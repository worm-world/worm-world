use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, TS)]
#[ts(export, export_to = "../src/models/db/db_ScheduleTree.ts")]
#[serde(rename = "db_ScheduleTree")]
pub struct ScheduleTree {
    pub id: u64,
    #[serde(rename = "treeId")]
    pub tree_id: u64,
}
