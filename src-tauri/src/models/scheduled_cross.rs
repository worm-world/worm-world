use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct ScheduledCross {
    pub id: u64,
    #[serde(rename = "crossId")]
    pub cross_id: u64,
    pub deadline: String,
    pub completed: bool,
}
