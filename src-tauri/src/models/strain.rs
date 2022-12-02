use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, TS)]
#[ts(export, export_to = "../src/models/db/db_Strain.ts")]
#[serde(rename = "db_Strain")]
pub struct Strain {
    pub name: String,
    pub notes: String,
}
