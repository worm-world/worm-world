use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/task/Action.ts")]
pub enum Action {
    Cross,
    SelfCross,
    Freeze,
    Pcr,
}
impl From<i32> for Action {
    fn from(item: i32) -> Self {
        match item {
            0 => Self::Cross,
            1 => Self::SelfCross,
            2 => Self::Freeze,
            3 => Self::Pcr,
            _ => panic!("Invalid Action"),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/task/db_Task.ts")]
#[serde(rename = "db_Task")]
pub struct Task {
    pub id: String,
    pub due_date: Option<String>,
    pub action: Action,
    pub strain1: String,
    pub strain2: Option<String>,
    pub result: Option<String>,
    pub notes: Option<String>,
    pub completed: bool,
    pub tree_id: String,
}

impl From<TaskDb> for Task {
    fn from(item: TaskDb) -> Self {
        Self {
            id: item.id,
            due_date: item.due_date,
            action: (item.action as i32).into(),
            strain1: item.strain1,
            strain2: item.strain2,
            result: item.result,
            notes: item.notes,
            completed: item.completed == 1,
            tree_id: item.tree_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct TaskDb {
    pub id: String,
    pub due_date: Option<String>,
    pub action: i64,
    pub strain1: String,
    pub strain2: Option<String>,
    pub result: Option<String>,
    pub notes: Option<String>,
    pub completed: i64,
    pub tree_id: String,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_TaskFieldName.ts")]
pub enum TaskFieldName {
    Id,
    DueDate,
    Action,
    Strain1,
    Strain2,
    Result,
    Notes,
    Completed,
    TreeId,
}

impl FieldNameEnum for TaskFieldName {
    fn get_col_name(&self) -> String {
        match self {
            TaskFieldName::Id => "id".to_owned(),
            TaskFieldName::DueDate => "due_date".to_owned(),
            TaskFieldName::Action => "action".to_owned(),
            TaskFieldName::Strain1 => "strain1".to_owned(),
            TaskFieldName::Strain2 => "strain2".to_owned(),
            TaskFieldName::Result => "result".to_owned(),
            TaskFieldName::Notes => "notes".to_owned(),
            TaskFieldName::Completed => "completed".to_owned(),
            TaskFieldName::TreeId => "tree_id".to_owned(),
        }
    }
}
