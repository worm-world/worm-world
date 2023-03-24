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
            SELECT id, due_date, action, strain1, strain2, result, notes, tree_id, completed FROM tasks ORDER BY id
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
            "SELECT id, due_date, action, strain1, strain2, result, notes, tree_id, completed FROM tasks",
        );
        filter.add_filtered_query(&mut qb, true);

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
        let action_val: i32 = (task.action as u8).into();
        match sqlx::query!(
            "INSERT INTO tasks (id, due_date, action, strain1, strain2, result, notes, tree_id, completed)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ",
            task.id,
            task.due_date,
            action_val,
            task.strain1,
            task.strain2,
            task.result,
            task.notes,
            task.tree_id,
            task.completed,
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
        let action_val: i32 = (task.action as u8).into();
        match sqlx::query!(
            "UPDATE tasks
            SET due_date = $2,
                action = $3,
                strain1 = $4,
                strain2 = $5,
                result = $6,
                notes = $7,
                tree_id = $8,
                completed = $9
            WHERE
                id = $1",
            task.id,
            task.due_date,
            action_val,
            task.strain1,
            task.strain2,
            task.result,
            task.notes,
            task.tree_id,
            task.completed,
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
    pub async fn delete_task(&self, id: String) -> Result<(), DbError> {
        match sqlx::query!(
            "DELETE FROM tasks
            WHERE id = $1",
            id,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete Task error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }

    pub async fn delete_tasks(&self, tree: String) -> Result<(), DbError> {
        match sqlx::query!(
            "DELETE FROM tasks
            WHERE tree_id = $1",
            tree,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete Task error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }

    pub async fn delete_all_tasks(&self) -> Result<(), DbError> {
        match sqlx::query!("DELETE FROM tasks")
            .execute(&self.conn_pool)
            .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete Task error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::models::task::{Action, Task, TaskFieldName};
    use crate::models::tree::Tree;
    use crate::InnerDbState;
    use crate::{
        dummy::testdata,
        models::filter::{Filter, FilterGroup},
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
                filters: vec![vec![(TaskFieldName::Id, Filter::Equal("1".to_owned()))]],
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

        let tree = Tree {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };
        state.insert_tree(&tree).await?;

        let expected = Task {
            id: "1".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            result: Some("{}".to_string()),
            notes: None,
            tree_id: "1".to_string(),
            completed: true,
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

        let tree = Tree {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };
        state.insert_tree(&tree).await?;

        let expected = Task {
            id: "1".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            result: Some("{}".to_string()),
            notes: None,
            tree_id: "1".to_string(),
            completed: true,
        };

        state.insert_task(&expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![expected], tasks);

        let new_expected = Task {
            id: "1".to_string(),
            due_date: Some("2012-01-02".to_string()),
            action: Action::Cross,
            strain1: "{blah}".to_string(),
            strain2: Some("{foo}".to_string()),
            result: Some("{}".to_string()),
            notes: Some("foo note".to_string()),
            tree_id: "1".to_string(),
            completed: false,
        };
        state.update_task(&new_expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![new_expected], tasks);
        Ok(())
    }
    /* #endregion */

    /* #region delete_task tests */
    #[sqlx::test]
    async fn test_delete_task(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        let tree = Tree {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };
        state.insert_tree(&tree).await?;

        let expected = Task {
            id: "1".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            result: Some("{}".to_string()),
            notes: None,
            tree_id: "1".to_string(),
            completed: true,
        };

        state.insert_task(&expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![expected], tasks);

        state.delete_task("1".to_string()).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        Ok(())
    }

    #[sqlx::test]
    async fn test_delete_tasks(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        let tree1 = Tree {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: false,
        };
        let tree2 = Tree {
            id: "2".to_string(),
            name: "tree2".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: false,
        };
        state.insert_tree(&tree1).await?;
        state.insert_tree(&tree2).await?;

        let task1 = Task {
            id: "3".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            notes: None,
            tree_id: "1".to_string(),
            completed: true,
            result: Some("".to_string()),
        };
        let task2 = Task {
            id: "4".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::SelfCross,
            strain1: "{}".to_string(),
            strain2: None,
            notes: None,
            tree_id: "1".to_string(),
            completed: true,
            result: Some("".to_string()),
        };
        let task3 = Task {
            id: "5".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Pcr,
            strain1: "{}".to_string(),
            strain2: None,
            notes: None,
            tree_id: "2".to_string(),
            completed: true,
            result: Some("".to_string()),
        };

        state.insert_task(&task1).await?;
        state.insert_task(&task2).await?;
        state.insert_task(&task3).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![task1, task2, task3], tasks);

        state.delete_tasks("1".to_string()).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 1);
        assert_eq!(tasks[0].id, "5");

        Ok(())
    }

    #[sqlx::test]
    async fn test_delete_all_tasks(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        let tree1 = Tree {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: false,
        };
        let tree2 = Tree {
            id: "2".to_string(),
            name: "tree2".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: false,
        };
        state.insert_tree(&tree1).await?;
        state.insert_tree(&tree2).await?;

        let task1 = Task {
            id: "3".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            strain1: "{}".to_string(),
            strain2: Some("{}".to_string()),
            notes: None,
            tree_id: "1".to_string(),
            completed: true,
            result: Some("".to_string()),
        };
        let task2 = Task {
            id: "4".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::SelfCross,
            strain1: "{}".to_string(),
            strain2: None,
            notes: None,
            tree_id: "1".to_string(),
            completed: true,
            result: Some("".to_string()),
        };
        let task3 = Task {
            id: "5".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Pcr,
            strain1: "{}".to_string(),
            strain2: None,
            notes: None,
            tree_id: "2".to_string(),
            completed: true,
            result: Some("".to_string()),
        };

        state.insert_task(&task1).await?;
        state.insert_task(&task2).await?;
        state.insert_task(&task3).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![task1, task2, task3], tasks);

        state.delete_all_tasks().await?;
        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        Ok(())
    }

    /* #endregion */
}
