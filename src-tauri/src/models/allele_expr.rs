use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/db_AlleleExpression.ts")]
pub struct AlleleExpression {
    #[serde(rename = "alleleName")]
    pub allele_name: String,
    #[serde(rename = "expressingPhenotypeName")]
    pub expressing_phenotype_name: String,
    #[serde(rename = "expressingPhenotypeWild")]
    pub expressing_phenotype_wild: bool,
    pub dominance: Option<u8>,
}

impl From<AlleleExpressionDb> for AlleleExpression {
    fn from(item: AlleleExpressionDb) -> AlleleExpression {
        AlleleExpression {
            allele_name: item.allele_name,
            expressing_phenotype_name: item.expressing_phenotype_name,
            expressing_phenotype_wild: item.expressing_phenotype_wild == 1,
            dominance: item.dominance.map(|v| v as u8),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct AlleleExpressionDb {
    #[serde(rename = "alleleName")]
    pub allele_name: String,
    #[serde(rename = "expressingPhenotypeName")]
    pub expressing_phenotype_name: String,
    #[serde(rename = "expressingPhenotypeWild")]
    pub expressing_phenotype_wild: i64,
    pub dominance: Option<i64>,
}
