use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct AlleleExpression {
    #[serde(rename = "alleleName")]
    pub allele_name: String,
    #[serde(rename = "expressingPhenotype")]
    pub expressing_phenotype: String,
    pub dominance: u8,
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct ExpressionReqs {
    #[serde(rename = "alleleName")]
    pub allele_name: String,
    #[serde(rename = "expressingPhenotype")]
    pub expressing_phenotype: String,
    #[serde(rename = "requiredPhenotype")]
    pub required_phenotype: String,
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct ExpressionSups {
    #[serde(rename = "alleleName")]
    pub allele_name: String,
    #[serde(rename = "expressingPhenotype")]
    pub expressing_phenotype: String,
    #[serde(rename = "suppressingPhenotype")]
    pub suppressing_phenotype: String,
}
