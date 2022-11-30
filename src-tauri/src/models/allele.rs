use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/db_Allele.ts")]
pub struct Allele {
    pub name: String,
    pub contents: Option<String>,
    #[serde(rename = "geneName")]
    pub gene_name: Option<String>,
    #[serde(rename = "variationName")]
    pub variation_name: Option<String>,
}
