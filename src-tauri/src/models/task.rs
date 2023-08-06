use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/task/db_Action.ts")]
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
    #[serde(rename = "dueDate")]
    pub due_date: Option<String>,
    pub action: Action,
    #[serde(rename = "hermStrain")]
    pub herm_strain: String,
    #[serde(rename = "maleStrain")]
    pub male_strain: Option<String>,
    #[serde(rename = "resultStrain")]
    pub result_strain: Option<String>,
    pub notes: Option<String>,
    pub completed: bool,
    #[serde(rename = "crossDesignId")]
    pub cross_design_id: String,
    #[serde(rename = "childTaskId")]
    pub child_task_id: Option<String>,
}

impl From<TaskDb> for Task {
    fn from(item: TaskDb) -> Self {
        Self {
            id: item.id,
            due_date: item.due_date,
            action: (item.action as i32).into(),
            male_strain: item.male_strain,
            herm_strain: item.herm_strain,
            result_strain: item.result_strain,
            notes: item.notes,
            completed: item.completed == 1,
            cross_design_id: item.cross_design_id,
            child_task_id: item.child_task_id,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct TaskDb {
    pub id: String,
    pub due_date: Option<String>,
    pub action: i64,
    pub herm_strain: String,
    pub male_strain: Option<String>,
    pub result_strain: Option<String>,
    pub notes: Option<String>,
    pub completed: i64,
    pub cross_design_id: String,
    pub child_task_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_TaskFieldName.ts")]
pub enum TaskFieldName {
    Id,
    DueDate,
    Action,
    HermStrain,
    MaleStrain,
    ResultStrain,
    Notes,
    Completed,
    CrossDesignId,
    ChildTaskId,
}

impl FieldNameEnum for TaskFieldName {
    fn get_col_name(&self) -> String {
        match self {
            TaskFieldName::Id => "id".to_owned(),
            TaskFieldName::DueDate => "due_date".to_owned(),
            TaskFieldName::Action => "action".to_owned(),
            TaskFieldName::HermStrain => "herm_strain".to_owned(),
            TaskFieldName::MaleStrain => "male_strain".to_owned(),
            TaskFieldName::ResultStrain => "result_strain".to_owned(),
            TaskFieldName::Notes => "notes".to_owned(),
            TaskFieldName::Completed => "completed".to_owned(),
            TaskFieldName::CrossDesignId => "cross_design_id".to_owned(),
            TaskFieldName::ChildTaskId => "child_task_id".to_owned(),
        }
    }
}
