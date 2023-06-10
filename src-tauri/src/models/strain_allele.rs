use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_StrainAllele.ts")]
#[serde(rename = "db_StrainAllele")]
pub struct StrainAllele {
    pub strain_name: String,
    pub allele_name: String,
    pub is_on_top: bool,
    pub is_on_bot: bool,
}

impl From<StrainAlleleDb> for StrainAllele {
    fn from(item: StrainAlleleDb) -> StrainAllele {
        StrainAllele {
            strain_name: item.strain_name,
            allele_name: item.allele_name,
            is_on_top: item.is_on_top == 1,
            is_on_bot: item.is_on_bot == 1,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct StrainAlleleDb {
    pub strain_name: String,
    pub allele_name: String,
    pub is_on_top: i64,
    pub is_on_bot: i64,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_StrainAlleleFieldName.ts"
)]
pub enum StrainAlleleFieldName {
    StrainName,
    AlleleName,
    IsOnTop,
    IsOnBot,
}

impl FieldNameEnum for StrainAlleleFieldName {
    fn get_col_name(self: &StrainAlleleFieldName) -> String {
        match self {
            StrainAlleleFieldName::StrainName => "strain_name".to_owned(),
            StrainAlleleFieldName::AlleleName => "allele_name".to_owned(),
            StrainAlleleFieldName::IsOnTop => "is_on_top".to_owned(),
            StrainAlleleFieldName::IsOnBot => "is_on_bot".to_owned(),
        }
    }
}
