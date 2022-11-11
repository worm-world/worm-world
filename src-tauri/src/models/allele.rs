use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Allele {
    pub name: String,
    #[serde(rename = "geneName")]
    pub gene_name: String,
    pub contents: String,
}
