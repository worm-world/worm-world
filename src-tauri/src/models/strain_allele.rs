use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_StrainAllele.ts")]
#[serde(rename = "db_StrainAllele")]
pub struct StrainAllele {
    pub strain_name: String,
    pub allele_name: String,
    pub homozygous: bool,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_StrainAlleleFieldName.ts"
)]
pub enum StrainAlleleFieldName {
    StrainName,
    AlleleName,
    Homozygous,
}

impl FieldNameEnum for StrainAlleleFieldName {
    fn get_col_name(self: &StrainAlleleFieldName) -> String {
        match self {
            StrainAlleleFieldName::StrainName => "strain_name".to_owned(),
            StrainAlleleFieldName::AlleleName => "allele_name".to_owned(),
            StrainAlleleFieldName::Homozygous => "homozygous".to_owned(),
        }
    }
}
