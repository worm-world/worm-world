use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq)]
pub struct Gene {
    pub name: String,
    pub chromosome: Option<String>,
    #[serde(rename = "physLoc")]
    pub phys_loc: Option<i64>,
    #[serde(rename = "geneticLoc")]
    pub gen_loc: Option<f64>,
}
