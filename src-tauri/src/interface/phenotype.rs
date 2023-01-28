use super::{DbError, InnerDbState};
use crate::models::{
    expr_relation::ExpressionRelationFieldName,
    filter::{Filter, FilterQueryBuilder},
    phenotype::{Phenotype, PhenotypeDb, PhenotypeFieldName},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_phenotypes(&self) -> Result<Vec<Phenotype>, DbError> {
        match sqlx::query_as!(
            PhenotypeDb,
            "
            SELECT
                name, 
                wild,
                short_name,
                description, 
                male_mating,
                lethal,
                female_sterile,
                arrested,
                maturation_days
            FROM phenotypes
            ORDER BY name, wild
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(db_phens) => Ok(db_phens
                .into_iter()
                .map(|dp| dp.into())
                .collect::<Vec<Phenotype>>()),
            Err(e) => {
                eprint!("Get genes error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_phenotypes(
        &self,
        filter: &Filter<PhenotypeFieldName>,
    ) -> Result<Vec<Phenotype>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT
                name, 
                wild,
                short_name,
                description, 
                male_mating,
                lethal,
                female_sterile,
                arrested,
                maturation_days
            FROM phenotypes",
        );
        filter.add_filtered_query(&mut qb);
        match qb
            .build_query_as::<PhenotypeDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Phenotype error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn get_altering_phenotypes(
        &self,
        expr_relation_filter: &Filter<ExpressionRelationFieldName>,
        phenotype_filter: &Filter<PhenotypeFieldName>,
    ) -> Result<Vec<Phenotype>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT DISTINCT
            p.name,
            p.wild,
            p.short_name,
            p.description,
            p.male_mating,
            p.lethal,
            p.female_sterile,
            p.arrested,
            p.maturation_days
            FROM
                (
                SELECT
                    altering_phenotype_name AS pn,
                    altering_phenotype_wild AS pw
                FROM
                    expr_relations",
        );
        expr_relation_filter.add_filtered_query(&mut qb);
        qb.push(
            ") JOIN phenotypes AS p 
            ON p.name == pn
            AND p.wild == pw\n",
        );
        phenotype_filter.add_filtered_query(&mut qb);

        match qb
            .build_query_as::<PhenotypeDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Altering Phenotypes error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn insert_phenotype(&self, phenotype: &Phenotype) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO phenotypes (name, wild, short_name, description, male_mating, lethal, female_sterile, arrested, maturation_days)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ",
            phenotype.name,
            phenotype.wild,
            phenotype.short_name,
            phenotype.description,
            phenotype.male_mating,
            phenotype.lethal,
            phenotype.female_sterile,
            phenotype.arrested,
            phenotype.maturation_days,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Phenotype error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::dummy::testdata;
    use crate::models::expr_relation::ExpressionRelationFieldName;
    use crate::models::filter::{Filter, FilterType, Order};
    use crate::models::phenotype::{Phenotype, PhenotypeFieldName};
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_phenotype tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_phenotypes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let phens = state.get_phenotypes().await?;

        let expected_phens = testdata::get_phenotypes();
        assert_eq!(phens, expected_phens);
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_phenotypes tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_phenotypes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_phenotypes(&Filter::<PhenotypeFieldName> {
                filters: vec![
                    vec![(
                        PhenotypeFieldName::MaleMating,
                        FilterType::LessThan("2".to_owned(), false),
                    )],
                    vec![(PhenotypeFieldName::MaturationDays, FilterType::Null)],
                ],
                order_by: vec![(PhenotypeFieldName::Name, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_phenotypes());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_phenotypes_maturation_less_equal_3(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_phenotypes(&Filter::<PhenotypeFieldName> {
                filters: vec![vec![(
                    PhenotypeFieldName::MaturationDays,
                    FilterType::LessThan("3".to_owned(), true),
                )]],
                order_by: vec![(PhenotypeFieldName::Name, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::get_phenotypes_maturation_less_equal_3());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_phenotypes_by_short_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_phenotypes(&Filter::<PhenotypeFieldName> {
                filters: vec![vec![(
                    PhenotypeFieldName::ShortName,
                    FilterType::Like("NLS".to_owned()),
                )]],
                order_by: vec![(PhenotypeFieldName::Name, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::search_phenotypes_by_short_name());
        Ok(())
    }
    /* #endregion */

    /* #region get_altering_phenotypes tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_altering_phenotypes(pool: Pool<Sqlite>) -> Result<()> {
        let expr_relation_filter = Filter::<ExpressionRelationFieldName> {
            filters: vec![
                vec![(
                    ExpressionRelationFieldName::AlleleName,
                    FilterType::Equal("oxIs644".to_owned()),
                )],
                vec![(
                    ExpressionRelationFieldName::ExpressingPhenotypeName,
                    FilterType::Equal("YFP(pharynx)".to_owned()),
                )],
                vec![(
                    ExpressionRelationFieldName::ExpressingPhenotypeWild,
                    FilterType::False,
                )],
                vec![(
                    ExpressionRelationFieldName::IsSuppressing,
                    FilterType::False,
                )],
            ],
            order_by: vec![],
        };

        let phenotype_filter = Filter::<PhenotypeFieldName> {
            filters: vec![
                vec![(PhenotypeFieldName::Wild, FilterType::True)],
                vec![(
                    PhenotypeFieldName::MaturationDays,
                    FilterType::GreaterThan("3".to_owned(), true),
                )],
            ],
            order_by: vec![],
        };

        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_altering_phenotypes(&expr_relation_filter, &phenotype_filter)
            .await?;

        assert_eq!(exprs, testdata::get_altering_phenotypes());
        Ok(())
    }
    /* #endregion */

    /* #region insert_phenotype tests */
    #[sqlx::test]
    async fn test_insert_phenotype(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let phens = state.get_phenotypes().await?;
        assert_eq!(phens.len(), 0);

        let expected = Phenotype {
            name: "unc-5".to_string(),
            wild: true,
            short_name: "unc".to_string(),
            description: None,
            male_mating: Some(0),
            lethal: Some(true),
            female_sterile: Some(true),
            arrested: Some(true),
            maturation_days: Some(4.0),
        };

        state.insert_phenotype(&expected).await?;

        let phens = state.get_phenotypes().await?;
        assert_eq!(vec![expected], phens);
        Ok(())
    }
    /* #endregion */
}
