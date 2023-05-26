use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, TS, sqlx::FromRow)]
pub struct TaskCondition {
    pub task_id: String,
    pub cond_name: String,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_TaskConditionFieldName.ts"
)]
pub enum TaskConditionFieldName {
    Id,
    Name,
}

impl FieldNameEnum for TaskConditionFieldName {
    fn get_col_name(&self) -> String {
        match self {
            TaskConditionFieldName::Id => "task_id".to_owned(),
            TaskConditionFieldName::Name => "cond_name".to_owned(),
        }
    }
}
