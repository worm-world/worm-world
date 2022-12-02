use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, TS)]
#[ts(export, export_to = "../src/models/db/db_TreeStrain.ts")]
#[serde(rename = "db_TreeStrain")]
pub struct TreeStrain {
    pub id: u64,
    #[serde(rename = "treeId")]
    pub tree_id: String,
    #[serde(rename = "crossId")]
    pub cross_id: u64,
    pub strain: String,
    pub sex: u8,
}
