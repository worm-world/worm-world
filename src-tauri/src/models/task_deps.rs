use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, TS, sqlx::FromRow)]
pub struct TaskDepenency {
    pub parent_id: String,
    pub child_id: String,
}


#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/TaskDependencyFieldName.ts")]
pub enum TaskDepenencyFieldName {
    ParentId,
    ChildId,
}

impl FieldNameEnum for TaskDepenencyFieldName {
    fn get_col_name(&self) -> String {
        match self {
            TaskDepenencyFieldName::ParentId => "parent_id".to_owned(),
            TaskDepenencyFieldName::ChildId => "child_id".to_owned(),
        }
    }
}
