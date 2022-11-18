pub mod gene;
pub mod phenotype;

use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};
use thiserror::Error;

#[derive(Error, Debug, Serialize, Deserialize)]
pub enum DbError {
    #[error("Failed to execute query: {0}")]
    SqlQueryError(String),
    #[error("Failed to execute insert: {0}")]
    SqlInsertError(String),
}

pub struct InnerDbState {
    pub conn_pool: Pool<Sqlite>,
}