use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct ScheduleTree {
    pub id: u64,
    #[serde(rename = "treeId")]
    pub tree_id: u64,
}
