use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq)]
pub struct Allele {
    pub name: String,
    pub contents: Option<String>,
    #[serde(rename = "geneName")]
    pub gene_name: Option<String>,
    #[serde(rename = "variationName")]
    pub variation_name: Option<String>,
}
