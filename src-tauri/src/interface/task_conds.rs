use super::{DbError, InnerDbState};
use crate::models::{
    filter::{FilterGroup, FilterQueryBuilder},
    task_conds::{TaskCondition, TaskConditionFieldName},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_task_conditions(&self) -> Result<Vec<TaskCondition>, DbError> {
        match sqlx::query_as!(
            TaskCondition,
            "
            SELECT * FROM task_conds ORDER BY task_id
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(task_conditions) => Ok(task_conditions),
            Err(e) => {
                eprint!("Get task conditions error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_task_conditions(
        &self,
        filter: &FilterGroup<TaskConditionFieldName>,
    ) -> Result<Vec<TaskCondition>, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT task_id, cond_name FROM task_conds");
        filter.add_filtered_query(&mut qb, true);

        match qb
            .build_query_as::<TaskCondition>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(task_condtions) => Ok(task_condtions),
            Err(e) => {
                eprint!("Get Filtered Task Conditions error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_task_condition(
        &self,
        task_condtions: &TaskCondition,
    ) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO task_conds (task_id, cond_name)
            VALUES($1, $2)
            ",
            task_condtions.task_id,
            task_condtions.cond_name,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Task Condition error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::models::condition::Condition;
    use crate::models::task::{Action, Task};
    use crate::models::task_conds::{TaskCondition, TaskConditionFieldName};
    use crate::InnerDbState;
    use crate::Tree;
    use crate::{
        dummy::testdata,
        models::filter::{Filter, FilterGroup},
    };
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_tasks tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_tasks_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut task_condition: Vec<TaskCondition> = state.get_task_conditions().await?;
        task_condition.sort_by(|a, b| (a.task_id.cmp(&b.task_id)));

        assert_eq!(task_condition, testdata::get_task_conditions());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_tasks tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_task_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_task_conditions(&FilterGroup::<TaskConditionFieldName> {
                filters: vec![vec![(
                    TaskConditionFieldName::Id,
                    Filter::Equal("1".to_owned()),
                )]],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_task_conditions());
        Ok(())
    }
    /* #endregion */

    /* #region insert_task tests */
    #[sqlx::test]
    async fn test_insert_task_condition(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        state
            .insert_tree(&Tree {
                id: 1.to_string(),
                name: "test1".to_string(),
                last_edited: "2012-01-01".to_string(),
                data: "{}".to_string(),
                editable: true,
            })
            .await?;
        state
            .insert_task(&Task {
                id: 1.to_string(),
                due_date: Some("2012-01-01".to_string()),
                action: Action::Cross,
                strain1: "{}".to_string(),
                strain2: Some("{}".to_string()),
                result: Some("{}".to_string()),
                notes: Some("example note".to_string()),
                tree_id: 1.to_string(),
                completed: true,
            })
            .await?;

        state
            .insert_condition(&Condition {
                name: "Tetracycline".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(4.0),
            })
            .await?;

        let task_conditions: Vec<TaskCondition> = state.get_task_conditions().await?;
        assert_eq!(task_conditions.len(), 0);

        let expected = TaskCondition {
            task_id: 1.to_string(),
            cond_name: "Tetracycline".to_string(),
        };

        state.insert_task_condition(&expected).await?;
        let task_conditions: Vec<TaskCondition> = state.get_task_conditions().await?;

        assert_eq!(vec![expected], task_conditions);
        Ok(())
    }

    /* #endregion */
}
