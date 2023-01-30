use super::{DbError, InnerDbState};
use crate::models::{
    filter::{FilterGroup, FilterQueryBuilder},
    task::{Task, TaskDb, TaskFieldName},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_tasks(&self) -> Result<Vec<Task>, DbError> {
        match sqlx::query_as!(
            TaskDb,
            "
            SELECT id, due_date, action, strain1, strain2 FROM tasks ORDER BY id
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(tasks) => Ok(tasks.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get tasks error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_tasks(
        &self,
        filter: &FilterGroup<TaskFieldName>,
    ) -> Result<Vec<Task>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT id, due_date, action, strain1, strain2 FROM tasks",
        );
        filter.add_filtered_query(&mut qb);

        match qb
            .build_query_as::<TaskDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Task error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_task(&self, task: &Task) -> Result<(), DbError> {
        let action_val : i64 = (task.action as u8).into();
        match sqlx::query!(
            "INSERT INTO tasks (id, due_date, action, strain1, strain2)
            VALUES($1, $2, $3, $4, $5)
            ",
            task.id,
            task.due_date,
            action_val,
            task.strain1,
            task.strain2,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Task error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn update_task(&self, task: &Task) -> Result<(), DbError> {
        let action_val : i64 = (task.action as u8).into();
        match sqlx::query!(
            "UPDATE tasks
            SET due_date = $2,
                action = $3,
                strain1 = $4,
                strain2 = $5
            WHERE
                id = $1",
            task.id,
            task.due_date,
            action_val,
            task.strain1,
            task.strain2,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Update Task error: {e}");
                Err(DbError::Update(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::models::task::{Task, TaskFieldName, Action};
    use crate::InnerDbState;
    use crate::{
        dummy::testdata,
        models::filter::{FilterGroup, Filter},
    };
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_tasks tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_tasks(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut tasks: Vec<Task> = state.get_tasks().await?;
        tasks.sort_by(|a, b| (a.id.cmp(&b.id)));

        assert_eq!(tasks, testdata::get_tasks());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_tasks tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_tasks(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_tasks(&FilterGroup::<TaskFieldName> {
                filters: vec![vec![
                    (
                        TaskFieldName::Id,
                        Filter::Equal("1".to_owned()),
                    ),
                ]],
                order_by: vec![],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_tasks());
        Ok(())
    }
    /* #endregion */

    /* #region insert_task tests */
    #[sqlx::test]
    async fn test_insert_task(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        let expected = Task {
            id: 1,
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
        };

        state.insert_task(&expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![expected], tasks);
        Ok(())
    }

    /* #endregion */
    /* #region update_task tests */

    #[sqlx::test]
    async fn test_update_task(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        let expected = Task {
            id: 1,
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
        };

        state.insert_task(&expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![expected], tasks);

        let new_expected = Task {
            id: 1,
            due_date: Some("2012-01-02".to_string()),
            action: Action::Cross,
            strain1: "{blah}".to_string(),
            strain2: Some("{foo}".to_string()),
        };
        state.update_task(&new_expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![new_expected], tasks);
        Ok(())
    }
    /* #endregion */
}
