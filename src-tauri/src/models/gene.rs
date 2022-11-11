use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Gene {
    pub name: String,
    pub chromosome: String,
    #[serde(rename = "physLoc")]
    pub phys_loc: String,
    #[serde(rename = "geneticLoc")]
    pub genetic_loc: String,
}
