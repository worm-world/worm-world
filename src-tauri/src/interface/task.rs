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
            SELECT id, due_date, action, herm_strain, male_strain, result_strain, notes, cross_design_id, child_task_id, completed FROM tasks ORDER BY id
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
            "SELECT id, due_date, action, herm_strain, male_strain, result_strain, notes, cross_design_id, child_task_id, completed FROM tasks",
        );
        filter.add_filtered_query(&mut qb, true, true);

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
            "INSERT INTO tasks (id, due_date, action, herm_strain, male_strain, result_strain, notes, cross_design_id, completed, child_task_id)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ",
            task.id,
            task.due_date,
            action_val,
            task.herm_strain,
            task.male_strain,
            task.result_strain,
            task.notes,
            task.cross_design_id,
            task.completed,
            task.child_task_id,
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
            SET due_date = ?,
                action = ?,
                herm_strain = ?,
                male_strain = ?,
                result_strain = ?,
                notes = ?,
                cross_design_id = ?,
                completed = ?,
                child_task_id = ?
            WHERE
                id = ?",
            task.due_date,
            action_val,
            task.herm_strain,
            task.male_strain,
            task.result_strain,
            task.notes,
            task.cross_design_id,
            task.completed,
            task.child_task_id,
            task.id
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
            WHERE id = ?",
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

    pub async fn delete_tasks(&self, cross_design: String) -> Result<(), DbError> {
        match sqlx::query!(
            "DELETE FROM tasks
            WHERE cross_design_id = ?",
            cross_design,
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

    use crate::models::cross_design::CrossDesign;
    use crate::models::task::{Action, Task, TaskFieldName};
    use crate::InnerDbState;
    use crate::{
        interface::mock,
        models::filter::{Filter, FilterGroup},
    };
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_tasks(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut tasks: Vec<Task> = state.get_tasks().await?;
        tasks.sort_by(|a, b| (a.id.cmp(&b.id)));

        assert_eq!(tasks, mock::task::get_tasks());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_tasks(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_tasks(&FilterGroup::<TaskFieldName> {
                filters: vec![vec![(TaskFieldName::Id, Filter::Equal("1".to_owned()))]],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::task::get_filtered_tasks());
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_task(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        let cross_design = CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };
        state.insert_cross_design(&cross_design).await?;

        let expected = Task {
            id: "1".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            herm_strain: "{}".to_string(),
            male_strain: Some("{}".to_string()),
            result_strain: Some("{}".to_string()),
            notes: None,
            cross_design_id: "1".to_string(),
            completed: true,
            child_task_id: None,
        };

        state.insert_task(&expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![expected], tasks);
        Ok(())
    }

    #[sqlx::test]
    async fn test_update_task(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        let cross_design = CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };
        state.insert_cross_design(&cross_design).await?;

        let expected = Task {
            id: "1".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            herm_strain: "{}".to_string(),
            male_strain: Some("{}".to_string()),
            result_strain: Some("{}".to_string()),
            notes: None,
            cross_design_id: "1".to_string(),
            completed: true,
            child_task_id: None,
        };

        state.insert_task(&expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![expected], tasks);

        let new_expected = Task {
            id: "1".to_string(),
            due_date: Some("2012-01-02".to_string()),
            action: Action::Cross,
            herm_strain: "{blah}".to_string(),
            male_strain: Some("{foo}".to_string()),
            result_strain: Some("{}".to_string()),
            notes: Some("foo note".to_string()),
            cross_design_id: "1".to_string(),
            completed: false,
            child_task_id: None,
        };
        state.update_task(&new_expected).await?;
        let tasks: Vec<Task> = state.get_tasks().await?;

        assert_eq!(vec![new_expected], tasks);
        Ok(())
    }

    #[sqlx::test]
    async fn test_delete_task(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tasks: Vec<Task> = state.get_tasks().await?;
        assert_eq!(tasks.len(), 0);

        let cross_design = CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };
        state.insert_cross_design(&cross_design).await?;

        let expected = Task {
            id: "1".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            herm_strain: "{}".to_string(),
            male_strain: Some("{}".to_string()),
            result_strain: Some("{}".to_string()),
            notes: None,
            cross_design_id: "1".to_string(),
            completed: true,
            child_task_id: None,
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

        let cross_design1 = CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: false,
        };
        let cross_design2 = CrossDesign {
            id: "2".to_string(),
            name: "cross_design2".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: false,
        };
        state.insert_cross_design(&cross_design1).await?;
        state.insert_cross_design(&cross_design2).await?;

        let task1 = Task {
            id: "3".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            herm_strain: "{}".to_string(),
            male_strain: Some("{}".to_string()),
            notes: None,
            cross_design_id: "1".to_string(),
            completed: true,
            result_strain: Some("".to_string()),
            child_task_id: None,
        };
        let task2 = Task {
            id: "4".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::SelfCross,
            herm_strain: "{}".to_string(),
            male_strain: None,
            notes: None,
            cross_design_id: "1".to_string(),
            completed: true,
            result_strain: Some("".to_string()),
            child_task_id: None,
        };
        let task3 = Task {
            id: "5".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Pcr,
            herm_strain: "{}".to_string(),
            male_strain: None,
            notes: None,
            cross_design_id: "2".to_string(),
            completed: true,
            result_strain: Some("".to_string()),
            child_task_id: None,
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

        let cross_design1 = CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: false,
        };
        let cross_design2 = CrossDesign {
            id: "2".to_string(),
            name: "cross_design2".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: false,
        };
        state.insert_cross_design(&cross_design1).await?;
        state.insert_cross_design(&cross_design2).await?;

        let task1 = Task {
            id: "3".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Cross,
            herm_strain: "{}".to_string(),
            male_strain: Some("{}".to_string()),
            notes: None,
            cross_design_id: "1".to_string(),
            completed: true,
            result_strain: Some("".to_string()),
            child_task_id: None,
        };
        let task2 = Task {
            id: "4".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::SelfCross,
            herm_strain: "{}".to_string(),
            male_strain: None,
            notes: None,
            cross_design_id: "1".to_string(),
            completed: true,
            result_strain: Some("".to_string()),
            child_task_id: None,
        };
        let task3 = Task {
            id: "5".to_string(),
            due_date: Some("2012-01-01".to_string()),
            action: Action::Pcr,
            herm_strain: "{}".to_string(),
            male_strain: None,
            notes: None,
            cross_design_id: "2".to_string(),
            completed: true,
            result_strain: Some("".to_string()),
            child_task_id: None,
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
}
