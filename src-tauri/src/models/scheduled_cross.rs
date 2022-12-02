use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, TS)]
#[ts(export, export_to = "../src/models/db/db_ScheduledCross.ts")]
#[serde(rename = "db_ScheduledCross")]
pub struct ScheduledCross {
    pub id: u64,
    #[serde(rename = "crossId")]
    pub cross_id: u64,
    pub deadline: String,
    pub completed: bool,
}
