use super::special_filter::SpecialFilter;
use crate::models::allele::AlleleFieldName;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_AlleleFilter.ts")]
pub struct AlleleFilter {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    #[ts(type = "Map<AlleleFieldName, string[]>")]
    pub col_filters: HashMap<AlleleFieldName, Vec<String>>,
    #[serde(rename = "fieldSpecialFilters")]
    #[ts(type = "Map<AlleleFieldName, SpecialFilter[]>")]
    pub col_special_filters: HashMap<AlleleFieldName, Vec<SpecialFilter>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<AlleleFieldName>,
}
