use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, TS)]
#[ts(export, export_to = "../src/models/db/db_Tree.ts")]
pub struct Tree {
    pub id: u64,
    pub name: String,
    #[serde(rename = "lastEdited")]
    pub last_edited: u64,
}
