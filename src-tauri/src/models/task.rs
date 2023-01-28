use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/db_Task.ts")]
pub enum Action {
    Cross,
    SelfCross,
    Freeze,
    Pcr,
}
impl From<i64> for Action {
    fn from(item: i64) -> Self {
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
#[ts(export, export_to = "../src/models/db/db_Task.ts")]
#[serde(rename = "db_Task")]
pub struct Task {
    pub id: i64,
    pub due_date: Option<String>,
    pub action: Action,
    pub strain1: String,
    pub strain2: Option<String>,
}

impl From<TaskDb> for Task {
    fn from(item: TaskDb) -> Self {
        Self{
            id: item.id,
            due_date: item.due_date,
            action: item.action.into(),
            strain1: item.strain1,
            strain2: item.strain2,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct TaskDb {
    pub id: i64,
    pub due_date: Option<String>,
    pub action: i64,
    pub strain1: String,
    pub strain2: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_TaskFieldName.ts")]
pub enum TaskFieldName {
    Id,
    DueDate,
    Action,
    Strain1,
    Strain2,
}

impl FieldNameEnum for TaskFieldName {
    fn get_col_name(&self) -> String {
        match self {
            TaskFieldName::Id => "id".to_owned(),
            TaskFieldName::DueDate => "due_date".to_owned(),
            TaskFieldName::Action => "action".to_owned(),
            TaskFieldName::Strain1 => "strain1".to_owned(),
            TaskFieldName::Strain2 => "strain2".to_owned(),
        }
    }
}
