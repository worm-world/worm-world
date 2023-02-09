use super::{DbError, InnerDbState};
use crate::models::{
    filter::{FilterGroup, FilterQueryBuilder},
    task_deps::{TaskDepenency, TaskDepenencyFieldName},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_task_dependancies(&self) -> Result<Vec<TaskDepenency>, DbError> {
        match sqlx::query_as!(
            TaskDepenency,
            "
            SELECT parent_id, child_id FROM task_deps ORDER BY parent_id
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(task_depenency) => Ok(task_depenency),
            Err(e) => {
                eprint!("Get task depenency error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_task_depenency(
        &self,
        filter: &FilterGroup<TaskDepenencyFieldName>,
    ) -> Result<Vec<TaskDepenency>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT parent_id, child_id FROM task_deps",
        );
        filter.add_filtered_query(&mut qb);

        match qb
            .build_query_as::<TaskDepenency>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(task_depenency) => Ok(task_depenency),
            Err(e) => {
                eprint!("Get Filtered Task Depenency error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_task_depenency(&self, task_depenency: &TaskDepenency) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO task_deps (parent_id, child_id)
            VALUES($1, $2)
            ",
            task_depenency.parent_id,
            task_depenency.child_id,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Task depenency error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::models::task_deps::{TaskDepenency, TaskDepenencyFieldName};
    use crate::models::task::{Task, Action};
    use crate::InnerDbState;
    use crate::{
        dummy::testdata,
        models::filter::{FilterGroup, Filter},
    };
    use crate::Tree;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_tasks tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_task_dependancies(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut task_dependancies: Vec<TaskDepenency> = state.get_task_dependancies().await?;
        task_dependancies.sort_by(|a, b| (a.parent_id.cmp(&b.parent_id)));

        assert_eq!(task_dependancies, testdata::get_task_dependancies());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_tasks tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_task_dependancies(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_task_depenency(&FilterGroup::<TaskDepenencyFieldName> {
                filters: vec![vec![
                    (
                        TaskDepenencyFieldName::ParentId,
                        Filter::Equal("1".to_owned()),
                    ),
                ]],
                order_by: vec![],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_task_depenency());
        Ok(())
    }
    /* #endregion */

    /* #region insert_task tests */
    #[sqlx::test]
    async fn test_insert_task_depenency(pool: Pool<Sqlite>) -> Result<()> {
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
                notes: Some("example note".to_string()),
                tree_id: 1.to_string(),
                completed: true,
            })
            .await?;

        state
            .insert_task(&Task {
                id: 2.to_string(),
                due_date: Some("2012-01-02".to_string()),
                action: Action::Cross,
                strain1: "{blah}".to_string(),
                strain2: Some("{foo}".to_string()),
                notes: Some("example note".to_string()),
                tree_id: 1.to_string(),
                completed: true,
            })
            .await.unwrap();

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 2);
        println!("{}", tasks[1].id);

        let task_dependancies: Vec<TaskDepenency> = state.get_task_dependancies().await?;
        assert_eq!(task_dependancies.len(), 0);

        let expected = TaskDepenency {
            parent_id: 1.to_string(),
            child_id: 2.to_string(),
        };

        state.insert_task_depenency(&expected).await?;
        let task_dependancies: Vec<TaskDepenency> = state.get_task_dependancies().await?;

        assert_eq!(vec![expected], task_dependancies);
        Ok(())
    }

    /* #endregion */
}
