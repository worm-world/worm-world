use super::{bulk::Bulk, DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::{
    expr_relation::{ExpressionRelation, ExpressionRelationDb, ExpressionRelationFieldName},
    filter::{FilterGroup, FilterQueryBuilder},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_expr_relations(&self) -> Result<Vec<ExpressionRelation>, DbError> {
        match sqlx::query_as!(
            ExpressionRelationDb,
            "
            SELECT
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition,
                is_suppressing
            FROM
                expr_relations
            ORDER BY
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Expr Relations error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_expr_relations(
        &self,
        filter: &FilterGroup<ExpressionRelationFieldName>,
    ) -> Result<Vec<ExpressionRelation>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition,
                is_suppressing
            FROM
                expr_relations",
        );
        filter.add_filtered_query(&mut qb, true);

        match qb
            .build_query_as::<ExpressionRelationDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Exprs Relation error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_expr_relation(&self, relation: &ExpressionRelation) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO expr_relations (
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition,
                is_suppressing
            )
            VALUES($1, $2, $3, $4, $5, $6, $7)
            ",
            relation.allele_name,
            relation.expressing_phenotype_name,
            relation.expressing_phenotype_wild,
            relation.altering_phenotype_name,
            relation.altering_phenotype_wild,
            relation.altering_condition,
            relation.is_suppressing,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert ExprRelation error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn insert_expr_relations(
        &self,
        bulk: Bulk<ExpressionRelationDb>,
    ) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "INSERT INTO expr_relations (
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition,
                is_suppressing
            ) ",
        );
        if !bulk.errors.is_empty() {
            return Err(DbError::BulkInsert(format!(
                "Found errors on {} lines",
                bulk.errors.len()
            )));
        }
        let bind_limit = SQLITE_BIND_LIMIT / 7;
        if bulk.data.len() > bind_limit {
            return Err(DbError::BulkInsert(format!(
                "Row count exceeds max: {}",
                bind_limit
            )));
        }
        qb.push_values(bulk.data, |mut b, item| {
            b.push_bind(item.allele_name)
                .push_bind(item.expressing_phenotype_name)
                .push_bind(item.expressing_phenotype_wild)
                .push_bind(item.altering_phenotype_name)
                .push_bind(item.altering_phenotype_wild)
                .push_bind(item.altering_condition)
                .push_bind(item.is_suppressing);
        });

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Bulk Insert error: {e}");
                Err(DbError::BulkInsert(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use std::io::BufReader;

    use crate::dummy::testdata;
    use crate::interface::bulk::Bulk;
    use crate::models::expr_relation::{ExpressionRelationDb, ExpressionRelationFieldName};
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::models::{
        allele::Allele, allele_expr::AlleleExpression, expr_relation::ExpressionRelation,
        phenotype::Phenotype, variation_info::VariationInfo,
    };
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_expr_relations tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let rels = state.get_expr_relations().await?;
        assert_eq!(rels, testdata::get_expr_relations());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_expr_relations tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_expr_relations(&FilterGroup::<ExpressionRelationFieldName> {
                filters: vec![
                    vec![(
                        ExpressionRelationFieldName::AlteringCondition,
                        Filter::Equal("Histamine".to_owned()),
                    )],
                    vec![(
                        ExpressionRelationFieldName::ExpressingPhenotypeName,
                        Filter::Equal("paralyzed".to_owned()),
                    )],
                ],
                order_by: vec![(ExpressionRelationFieldName::AlleleName, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_expr_relations());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_expr_relations_many_and_clauses(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_expr_relations(&FilterGroup::<ExpressionRelationFieldName> {
                filters: vec![
                    vec![(
                        ExpressionRelationFieldName::ExpressingPhenotypeName,
                        Filter::Equal("paralyzed".to_owned()),
                    )],
                    vec![(
                        ExpressionRelationFieldName::AlteringCondition,
                        Filter::NotNull,
                    )],
                    vec![(
                        ExpressionRelationFieldName::ExpressingPhenotypeWild,
                        Filter::False,
                    )],
                    vec![(
                        ExpressionRelationFieldName::AlteringPhenotypeName,
                        Filter::Null,
                    )],
                    vec![(ExpressionRelationFieldName::IsSuppressing, Filter::False)],
                    vec![(
                        ExpressionRelationFieldName::AlleleName,
                        Filter::Equal("oxEx219999".to_string()),
                    )],
                ],
                order_by: vec![(ExpressionRelationFieldName::AlleleName, Order::Asc)],
            })
            .await?;

        assert_eq!(
            exprs,
            testdata::get_filtered_expr_relations_many_and_clauses()
        );
        Ok(())
    }
    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_expr_relations_by_allele_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_expr_relations(&FilterGroup::<ExpressionRelationFieldName> {
                filters: vec![vec![(
                    ExpressionRelationFieldName::AlleleName,
                    Filter::Like("6".to_owned()),
                )]],
                order_by: vec![(ExpressionRelationFieldName::AlleleName, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::search_expr_relations_by_allele_name());
        Ok(())
    }
    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_expr_relations_by_allele_name_and_expressing_phenotype(
        pool: Pool<Sqlite>,
    ) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_expr_relations(&FilterGroup::<ExpressionRelationFieldName> {
                filters: vec![
                    vec![(
                        ExpressionRelationFieldName::AlleleName,
                        Filter::Like("ox".to_owned()),
                    )],
                    vec![(
                        ExpressionRelationFieldName::ExpressingPhenotypeName,
                        Filter::Like("yfp".to_owned()),
                    )],
                ],
                order_by: vec![(ExpressionRelationFieldName::AlleleName, Order::Asc)],
            })
            .await?;

        assert_eq!(
            exprs,
            testdata::search_expr_relations_by_allele_name_and_expressing_phenotype()
        );
        Ok(())
    }
    /* #endregion get_filtered_expr_relations tests */

    /* #region insert_filtered_expr_relations tests */
    #[sqlx::test]
    async fn test_insert_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        // oxIs644 Variation
        state
            .insert_variation_info(&VariationInfo {
                allele_name: "oxIs644".to_string(), // not a foreign key
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            })
            .await?;
        // oxIs644 Allele
        state
            .insert_allele(&Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            })
            .await?;

        // YFP(pharynx) not wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "YFP(pharynx)".to_string(),
                wild: false,
                short_name: "YFP(pharynx)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await?;
        // Flp wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "Flp".to_string(),
                wild: true,
                short_name: "Flp(+)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await?;

        // oxIs644 -> YFP(pharynx) expr
        state
            .insert_allele_expr(&AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            })
            .await?;

        let rel = ExpressionRelation {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("Flp".to_string()),
            altering_phenotype_wild: Some(true),
            altering_condition: None,
            is_suppressing: false,
        };

        let csv_str = "allele_name,expressing_phenotype_name,expressing_phenotype_wild,altering_phenotype_name,altering_phenotype_wild,altering_condition,is_suppressing
oxIs644,YFP(pharynx),0,Flp,1,,0"
            .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new().has_headers(true).from_reader(buf);
        let bulk: Bulk<ExpressionRelationDb> = Bulk::from_reader(&mut reader);

        state.insert_expr_relations(bulk).await?;

        let rels = state.get_expr_relations().await?;
        assert_eq!(vec![rel], rels);
        Ok(())
    }

    /* #endregion */

    /* #region insert_filtered_expr_relation tests */
    #[sqlx::test]
    async fn test_insert_expr_relation(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        // oxIs644 Variation
        state
            .insert_variation_info(&VariationInfo {
                allele_name: "oxIs644".to_string(), // not a foreign key
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            })
            .await?;
        // oxIs644 Allele
        state
            .insert_allele(&Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            })
            .await?;

        // YFP(pharynx) not wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "YFP(pharynx)".to_string(),
                wild: false,
                short_name: "YFP(pharynx)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await?;
        // Flp wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "Flp".to_string(),
                wild: true,
                short_name: "Flp(+)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await?;

        // oxIs644 -> YFP(pharynx) expr
        state
            .insert_allele_expr(&AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: Some(2),
            })
            .await?;

        let rel = ExpressionRelation {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("Flp".to_string()),
            altering_phenotype_wild: Some(true),
            altering_condition: None,
            is_suppressing: false,
        };

        state.insert_expr_relation(&rel).await?;
        let rels = state.get_expr_relations().await?;
        assert_eq!(vec![rel], rels);
        Ok(())
    }
    #[sqlx::test]
    #[should_panic]
    async fn test_insert_expr_relation_missing_expr(pool: Pool<Sqlite>) {
        let state = InnerDbState { conn_pool: pool };
        // oxIs644 Variation
        state
            .insert_variation_info(&VariationInfo {
                allele_name: "oxIs644".to_string(), // not a foreign key
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            })
            .await
            .unwrap();
        // oxIs644 Allele
        state
            .insert_allele(&Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            })
            .await
            .unwrap();

        // YFP(pharynx) not wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "YFP(pharynx)".to_string(),
                wild: false,
                short_name: "YFP(pharynx)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await
            .unwrap();
        // Flp wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "Flp".to_string(),
                wild: true,
                short_name: "Flp(+)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await
            .unwrap();

        // oxIs644 -> YFP(pharynx) expr - MISSING

        let rel = ExpressionRelation {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("Flp".to_string()),
            altering_phenotype_wild: Some(true),
            altering_condition: None,
            is_suppressing: false,
        };

        state.insert_expr_relation(&rel).await.unwrap();
    }
    /* #endregion insert_filtered_expr_relation tests */
}
