use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct TreeStrain {
    pub id: u64,
    #[serde(rename = "treeId")]
    pub tree_id: String,
    #[serde(rename = "crossId")]
    pub cross_id: u64,
    pub strain: String,
    pub sex: u8,
}
