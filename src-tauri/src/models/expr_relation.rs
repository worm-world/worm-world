use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/db_ExpressionRelation.ts")]
#[serde(rename = "db_ExpressionRelation")]
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
        ExpressionRelation {
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

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_ExpressionRelationFieldName.ts"
)]
pub enum ExpressionRelationFieldName {
    AlleleName,
    ExpressingPhenotypeName,
    ExpressingPhenotypeWild,
    AlteringPhenotypeName,
    AlteringPhenotypeWild,
    AlteringCondition,
    IsSuppressing,
}

impl FieldNameEnum for ExpressionRelationFieldName {
    fn get_col_name(self: &ExpressionRelationFieldName) -> String {
        match self {
            ExpressionRelationFieldName::AlleleName => "allele_name".to_owned(),
            ExpressionRelationFieldName::ExpressingPhenotypeName => {
                "expressing_phenotype_name".to_owned()
            }
            ExpressionRelationFieldName::ExpressingPhenotypeWild => {
                "expressing_phenotype_wild".to_owned()
            }
            ExpressionRelationFieldName::AlteringPhenotypeName => {
                "altering_phenotype_name".to_owned()
            }
            ExpressionRelationFieldName::AlteringPhenotypeWild => {
                "altering_phenotype_wild".to_owned()
            }
            ExpressionRelationFieldName::AlteringCondition => "altering_condition".to_owned(),
            ExpressionRelationFieldName::IsSuppressing => "is_suppressing".to_owned(),
        }
    }
}
