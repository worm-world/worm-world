use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Cross {
    pub id: u64,
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct CrossParent {
    #[serde(rename = "crossId")]
    pub cross_id: u64,
    #[serde(rename = "treeStrainId")]
    pub tree_strain_id: u64,
}
