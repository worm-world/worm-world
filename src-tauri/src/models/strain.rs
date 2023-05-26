use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_Strain.ts")]
#[serde(rename = "db_Strain")]
pub struct Strain {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_StrainFieldName.ts")]
pub enum StrainFieldName {
    Name,
    Description,
}

impl FieldNameEnum for StrainFieldName {
    fn get_col_name(self: &StrainFieldName) -> String {
        match self {
            StrainFieldName::Name => "name".to_owned(),
            StrainFieldName::Description => "description".to_owned(),
        }
    }
}
