pub mod allele;
pub mod allele_expr;
pub mod bulk;
pub mod condition;
pub mod expr_relation;
pub mod gene;
pub mod phenotype;
pub mod task;
pub mod task_conds;
pub mod task_deps;
pub mod tree;
pub mod variation_info;

pub const SQLITE_BIND_LIMIT: usize = 32766;

use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};
use thiserror::Error;
use ts_rs::TS;

#[derive(Error, Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../src/models/db/db_Error.ts")]
#[serde(rename = "db_Error")]
pub enum DbError {
    #[error("Failed to execute query: {0}")]
    Query(String),
    #[error("Failed to execute insert: {0}")]
    Insert(String),
    #[error("Failed to execute update: {0}")]
    Update(String),
    #[error("Failed to execute delete: {0}")]
    Delete(String),
    #[error("Failed to execute bulk insert: {0}")]
    BulkInsert(String),
}

pub struct InnerDbState {
    pub conn_pool: Pool<Sqlite>,
}
