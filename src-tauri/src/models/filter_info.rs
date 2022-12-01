use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_FilterInfo.ts")]
pub struct FilterInfo {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    pub col_filters: HashMap<FieldName, Vec<String>>,
    #[serde(rename = "fieldRanges")]
    pub col_ranges: HashMap<FieldName, Vec<FilterRange>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<FieldName>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_FilterRange.ts")]
pub struct FilterRange {
    #[serde(rename = "fieldValue")]
    pub col_value: String,
    #[serde(rename = "rangeType")]
    pub range_type: RangeType,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_RangeType.ts")]
pub enum RangeType {
    LessThan,
    GreaterThan,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_FieldName.ts")]
pub enum FieldName {
    AlleleName,
    ExpressingPhenotypeName,
    ExpressingPhenotypeWild,
    Dominance,
    Name,
    Contents,
    GeneName,
    VariatinName,
    MaleMating,
    Lethal,
    FemaleSterile,
    Arrested,
    MaturationDays,
    AlteringPhenotypeName,
    AlteringPhenotypeWild,
    IsSuppressing,
    PhysLoc,
    GeneticLoc,
    Wild,
    ShortName,
    Description,
}

pub fn get_col_name(name: &FieldName) -> String {
    match name {
        FieldName::AlleleName => "allele_name".to_owned(),
        FieldName::ExpressingPhenotypeName => "expressing_phenotype_name".to_owned(),
        FieldName::ExpressingPhenotypeWild => "expressing_phenotype_wild".to_owned(),
        FieldName::Dominance => "dominance".to_owned(),
        FieldName::Name => "name".to_owned(),
        FieldName::Contents => "contents".to_owned(),
        FieldName::GeneName => "gene_name".to_owned(),
        FieldName::VariatinName => "variation_name".to_owned(),
        FieldName::MaleMating => "male_mating".to_owned(),
        FieldName::Lethal => "lethal".to_owned(),
        FieldName::FemaleSterile => "female_sterile".to_owned(),
        FieldName::Arrested => "arrested".to_owned(),
        FieldName::MaturationDays => "maturation_days".to_owned(),
        FieldName::AlteringPhenotypeName => "altering_phenotype_name".to_owned(),
        FieldName::AlteringPhenotypeWild => "altering_condition".to_owned(),
        FieldName::IsSuppressing => "is_suppressing".to_owned(),
        FieldName::PhysLoc => "phys_loc".to_owned(),
        FieldName::GeneticLoc => "gen_loc".to_owned(),
        FieldName::Wild => "wild".to_owned(),
        FieldName::ShortName => "short_name".to_owned(),
        FieldName::Description => "description".to_owned(),
    }
}
