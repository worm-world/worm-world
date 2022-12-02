use super::{
    query_builder::qb_condition::{get_order_by_clause, get_where_clause},
    DbError, InnerDbState,
};
use crate::models::{
    condition::{Condition, ConditionDb},
    filters::condition_filter::ConditionFilter,
};
use anyhow::Result;

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
        filter: &ConditionFilter,
    ) -> Result<Vec<Condition>, DbError> {
        let query = "
            SELECT
            name,
            description,
            male_mating,
            lethal,
            female_sterile,
            arrested,
            maturation_days
            FROM conditions"
            .to_owned()
            + &get_where_clause(filter)
            + &get_order_by_clause(filter);

        match sqlx::query_as::<_, ConditionDb>(&query)
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
    use std::collections::HashMap;

    use crate::models::condition::{Condition, ConditionFieldName};
    use crate::models::filters::special_filter::{SpecialFilter, SpecialFilterType};
    use crate::InnerDbState;
    use crate::{dummy::testdata, models::filters::condition_filter::ConditionFilter};
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
            .get_filtered_conditions(&ConditionFilter {
                col_filters: HashMap::new(),
                col_special_filters: HashMap::from([(
                    ConditionFieldName::MaturationDays,
                    vec![SpecialFilter {
                        col_value: "4".to_owned(),
                        filter_type: SpecialFilterType::LessThan,
                    }],
                )]),
                order_by: vec![ConditionFieldName::Name],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_conditions());
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
