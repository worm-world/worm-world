use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct Phenotype {
    pub name: String,
    #[serde(rename = "shortName")]
    pub short_name: String,
    pub description: String,
    #[serde(rename = "maleMating")]
    pub male_mating: u8,
    pub lethal: bool,
    #[serde(rename = "femaleSterile")]
    pub female_sterile: bool,
    pub arrested: bool,
    #[serde(rename = "growthRate")]
    pub growth_rate: u8,
    #[serde(rename = "environmentReq")]
    pub environment_req: String,
}
