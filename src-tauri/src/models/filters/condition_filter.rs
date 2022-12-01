use super::filter_range::FilterRange;
use crate::models::condition::ConditionFieldName;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_ConditionFilter.ts")]
pub struct ConditionFilter {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    pub col_filters: HashMap<ConditionFieldName, Vec<String>>,
    #[serde(rename = "fieldRanges")]
    pub col_ranges: HashMap<ConditionFieldName, Vec<FilterRange>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<ConditionFieldName>,
}
