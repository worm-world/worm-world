use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct StrainAlleles {
    #[serde(rename = "strainName")]
    pub strain_name: String,
    #[serde(rename = "alleleName")]
    pub allele_name: String,
}
