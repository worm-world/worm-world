use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, TS)]
#[ts(export, export_to = "../src/models/db/db_Cross.ts")]
pub struct Cross {
    pub id: u64,
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, TS)]
#[ts(export, export_to = "../src/models/db/db_CrossParent.ts")]
pub struct CrossParent {
    #[serde(rename = "crossId")]
    pub cross_id: u64,
    #[serde(rename = "treeStrainId")]
    pub tree_strain_id: u64,
}
