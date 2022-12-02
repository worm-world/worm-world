use super::special_filter::SpecialFilter;
use crate::models::gene::GeneFieldName;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_GeneFilter.ts")]
pub struct GeneFilter {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    pub col_filters: HashMap<GeneFieldName, Vec<String>>,
    #[serde(rename = "fieldRanges")]
    pub col_special_filters: HashMap<GeneFieldName, Vec<SpecialFilter>>,

    #[serde(rename = "orderBy")]
    pub order_by: Vec<GeneFieldName>,
}
