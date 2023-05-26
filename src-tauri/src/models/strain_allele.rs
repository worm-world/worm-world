use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_StrainAllele.ts")]
#[serde(rename = "db_StrainAllele")]
pub struct StrainAllele {
    pub strain: String,
    pub allele: String,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_StrainAlleleFieldName.ts"
)]
pub enum StrainAlleleFieldName {
    Strain,
    Allele,
}

impl FieldNameEnum for StrainAlleleFieldName {
    fn get_col_name(self: &StrainAlleleFieldName) -> String {
        match self {
            StrainAlleleFieldName::Strain => "strain".to_owned(),
            StrainAlleleFieldName::Allele => "allele".to_owned(),
        }
    }
}
