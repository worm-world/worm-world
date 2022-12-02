use crate::models::variation_info::VariationFieldName;

use super::special_filter::SpecialFilter;
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
    #[serde(rename = "fieldSpecialFilters")]
    pub col_special_filters: HashMap<VariationFieldName, Vec<SpecialFilter>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<VariationFieldName>,
}
