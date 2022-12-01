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

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_AlleleFieldName.ts")]
pub enum AlleleFieldName {
    Name,
    Contents,
    GeneName,
    VariationName,
}

pub fn get_col_name(name: &AlleleFieldName) -> String {
    match name {
        AlleleFieldName::Name => "name".to_owned(),
        AlleleFieldName::Contents => "contents".to_owned(),
        AlleleFieldName::GeneName => "gene_name".to_owned(),
        AlleleFieldName::VariationName => "variation_name".to_owned(),
    }
}
