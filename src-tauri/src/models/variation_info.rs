use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_VariationInfo.ts")]
pub struct VariationInfo {
    #[serde(rename = "alleleName")]
    pub allele_name: String,
    pub chromosome: Option<String>,
    #[serde(rename = "physLoc")]
    pub phys_loc: Option<i64>,
    #[serde(rename = "geneticLoc")]
    pub gen_loc: Option<f64>,
}
