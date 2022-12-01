use crate::models::variation_info::VariationFieldName;

use super::filter_range::FilterRange;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_VariationInfoFilter.ts"
)]
pub struct VariationInfoFilter {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    pub col_filters: HashMap<VariationFieldName, Vec<String>>,
    #[serde(rename = "fieldRanges")]
    pub col_ranges: HashMap<VariationFieldName, Vec<FilterRange>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<VariationFieldName>,
}
