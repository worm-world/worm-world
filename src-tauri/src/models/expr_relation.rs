use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, Eq)]
pub struct ExpressionRelation {
    #[serde(rename = "alleleName")]
    pub allele_name: String,

    #[serde(rename = "expressingPhenotypeName")]
    pub expressing_phenotype_name: String,
    #[serde(rename = "expressingPhenotypeWild")]
    pub expressing_phenotype_wild: bool,

    #[serde(rename = "alteringPhenotypeName")]
    pub altering_phenotype_name: Option<String>,
    #[serde(rename = "alteringPhenotypeWild")]
    pub altering_phenotype_wild: Option<bool>,

    #[serde(rename = "alteringCondition")]
    pub altering_condition: Option<String>,

    #[serde(rename = "isSuppressing")]
    pub is_suppressing: bool,
}

impl From<ExpressionRelationDb> for ExpressionRelation {
    fn from(item: ExpressionRelationDb) -> ExpressionRelation {
        ExpressionRelation{
            allele_name: item.allele_name,
            expressing_phenotype_name: item.expressing_phenotype_name,
            expressing_phenotype_wild: item.expressing_phenotype_wild == 1,

            altering_phenotype_name: item.altering_phenotype_name,
            altering_phenotype_wild: item.altering_phenotype_wild.map(|v| v == 1),

            altering_condition: item.altering_condition,

            is_suppressing: item.is_suppressing == 1,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct ExpressionRelationDb {
    pub allele_name: String,

    pub expressing_phenotype_name: String,
    pub expressing_phenotype_wild: i64,

    pub altering_phenotype_name: Option<String>,
    pub altering_phenotype_wild: Option<i64>,

    pub altering_condition: Option<String>,

    pub is_suppressing: i64,
}
