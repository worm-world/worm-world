use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, TS, sqlx::FromRow)]
pub struct TaskDependency {
    #[serde(rename = "parentId")]
    pub parent_id: String,
    #[serde(rename = "childId")]
    pub child_id: String,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_TaskDependencyFieldName.ts"
)]
pub enum TaskDependencyFieldName {
    ParentId,
    ChildId,
}

impl FieldNameEnum for TaskDependencyFieldName {
    fn get_col_name(&self) -> String {
        match self {
            TaskDependencyFieldName::ParentId => "parent_id".to_owned(),
            TaskDependencyFieldName::ChildId => "child_id".to_owned(),
        }
    }
}
