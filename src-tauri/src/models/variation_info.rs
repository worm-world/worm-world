use super::{chromosome::Chromosome, FieldNameEnum};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_VariationInfo.ts")]
#[serde(rename = "db_VariationInfo")]
pub struct VariationInfo {
    #[serde(rename = "alleleName")]
    pub allele_name: String,
    pub chromosome: Option<Chromosome>,
    #[serde(rename = "physLoc")]
    pub phys_loc: Option<i64>,
    #[serde(rename = "geneticLoc")]
    pub gen_loc: Option<f64>,
}

impl From<VariationInfoDb> for VariationInfo {
    fn from(item: VariationInfoDb) -> VariationInfo {
        VariationInfo {
            allele_name: item.allele_name,
            chromosome: item.chromosome.map(|v| v.into()),
            phys_loc: item.phys_loc,
            gen_loc: item.gen_loc,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct VariationInfoDb {
    #[serde(rename = "alleleName")]
    pub allele_name: String,
    pub chromosome: Option<String>,
    #[serde(rename = "physLoc")]
    pub phys_loc: Option<i64>,
    #[serde(rename = "geneticLoc")]
    pub gen_loc: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_VariationFieldName.ts")]
pub enum VariationFieldName {
    AlleleName,
    Chromosome,
    PhysLoc,
    GenLoc,
}
impl FieldNameEnum for VariationFieldName {
    fn get_col_name(self: &VariationFieldName) -> String {
        match self {
            VariationFieldName::AlleleName => "allele_name".to_owned(),
            VariationFieldName::Chromosome => "chromosome".to_owned(),
            VariationFieldName::PhysLoc => "phys_loc".to_owned(),
            VariationFieldName::GenLoc => "gen_loc".to_owned(),
        }
    }
}
