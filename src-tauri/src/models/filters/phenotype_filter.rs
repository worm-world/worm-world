use super::special_filter::SpecialFilter;
use crate::models::phenotype::PhenotypeFieldName;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_PhenotypeFilter.ts")]
pub struct PhenotypeFilter {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    #[ts(type = "Map<PhenotypeFieldName, string[]>")]
    pub col_filters: HashMap<PhenotypeFieldName, Vec<String>>,
    #[serde(rename = "fieldSpecialFilters")]
    #[ts(type = "Map<PhenotypeFieldName, SpecialFilter[]>")]
    pub col_special_filters: HashMap<PhenotypeFieldName, Vec<SpecialFilter>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<PhenotypeFieldName>,
}
