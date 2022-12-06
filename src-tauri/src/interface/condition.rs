use super::{DbError, InnerDbState};
use crate::models::{
    condition::{Condition, ConditionDb, ConditionFieldName},
    expr_relation::ExpressionRelationFieldName,
    filter::{Filter, FilterQueryBuilder},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_conditions(&self) -> Result<Vec<Condition>, DbError> {
        match sqlx::query_as!(
            ConditionDb,
            "
            SELECT
                name,
                description,
                male_mating,
                lethal,
                female_sterile,
                arrested,
                maturation_days
            FROM conditions
            ORDER BY name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(db_conds) => Ok(db_conds
                .into_iter()
                .map(|dp| dp.into())
                .collect::<Vec<Condition>>()),
            Err(e) => {
                eprint!("Get genes error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_conditions(
        &self,
        filter: &Filter<ConditionFieldName>,
    ) -> Result<Vec<Condition>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT
            name,
            description,
            male_mating,
            lethal,
            female_sterile,
            arrested,
            maturation_days
            FROM conditions",
        );
        filter.add_filtered_query(&mut qb);

        match qb
            .build_query_as::<ConditionDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Condition error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn get_altering_conditions(
        &self,
        filter: &Filter<ExpressionRelationFieldName>,
    ) -> Result<Vec<Condition>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT DISTINCT
            c.name,
            c.description,
            c.male_mating,
            c.lethal,
            c.female_sterile,
            c.arrested,
            c.maturation_days
          FROM
            (
              SELECT
                altering_condition AS ac
              FROM
                expr_relations",
        );
        filter.add_filtered_query(&mut qb);
        qb.push(
            ") JOIN conditions AS c 
            ON c.name == ac",
        );

        match qb
            .build_query_as::<ConditionDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Altering Conditions error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn insert_condition(&self, condition: &Condition) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO conditions (name, description, male_mating, lethal, female_sterile, arrested, maturation_days)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            ",
            condition.name,
            condition.description,
            condition.male_mating,
            condition.lethal,
            condition.female_sterile,
            condition.arrested,
            condition.maturation_days,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Condition error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::dummy::testdata;
    use crate::models::condition::{Condition, ConditionFieldName};
    use crate::models::expr_relation::ExpressionRelationFieldName;
    use crate::models::filter::{Filter, FilterType};
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let conds = state.get_conditions().await?;

        let expected_conds = testdata::get_conditions();
        assert_eq!(conds, expected_conds);
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_conditions(&Filter::<ConditionFieldName> {
                filters: vec![vec![(
                    ConditionFieldName::MaturationDays,
                    FilterType::LessThan("4".to_owned(), false),
                )]],
                order_by: vec![ConditionFieldName::Name],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_conditions());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_altering_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_altering_conditions(&Filter::<ExpressionRelationFieldName> {
                filters: vec![vec![
                    (
                        ExpressionRelationFieldName::AlleleName,
                        FilterType::Equal("n765".to_owned()),
                    ),
                    (
                        ExpressionRelationFieldName::ExpressingPhenotypeName,
                        FilterType::Equal("lin-15B".to_owned()),
                    ),
                    (
                        ExpressionRelationFieldName::ExpressingPhenotypeWild,
                        FilterType::False,
                    ),
                    (
                        ExpressionRelationFieldName::IsSuppressing,
                        FilterType::False,
                    ),
                ]],
                order_by: vec![ExpressionRelationFieldName::AlleleName],
            })
            .await?;

        assert_eq!(exprs, testdata::get_altering_conditions());
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_condition(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let conds = state.get_conditions().await?;
        assert_eq!(conds.len(), 0);

        let expected = Condition {
            name: "15C".to_string(),
            description: None,
            male_mating: Some(3),
            lethal: Some(false),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: Some(4.0),
        };

        state.insert_condition(&expected).await?;

        let conds = state.get_conditions().await?;
        assert_eq!(vec![expected], conds);
        Ok(())
    }
}
