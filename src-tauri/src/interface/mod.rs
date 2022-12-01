pub mod allele;
pub mod allele_expr;
pub mod condition;
pub mod expr_relation;
pub mod gene;
pub mod phenotype;
pub mod query_builder;
pub mod variation_info;

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
