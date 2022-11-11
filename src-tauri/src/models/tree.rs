use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Tree {
    pub id: u64,
    pub name: String,
    #[serde(rename = "lastEdited")]
    pub last_edited: u64,
}
