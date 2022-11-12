use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct User {
    pub id: i64,
    #[serde(rename = "userName")]
    pub user_name: String,
}
