use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, TS)]
#[ts(export, export_to = "../src/models/db/db_StrainAlleles.ts")]
#[serde(rename = "db_StrainAlleles")]
pub struct StrainAlleles {
    #[serde(rename = "strainName")]
    pub strain_name: String,
    #[serde(rename = "alleleName")]
    pub allele_name: String,
}
