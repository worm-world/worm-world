use super::special_filter::SpecialFilter;
use crate::models::expr_relation::ExpressionRelationFieldName;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_ExpressionRelationFilter.ts"
)]
pub struct ExpressionRelationFilter {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    #[ts(type = "Map<ExpressionRelationFieldName, string[]>")]
    pub col_filters: HashMap<ExpressionRelationFieldName, Vec<String>>,
    #[serde(rename = "fieldSpecialFilters")]
    #[ts(type = "Map<ExpressionRelationFieldName, SpecialFilter[]>")]
    pub col_special_filters: HashMap<ExpressionRelationFieldName, Vec<SpecialFilter>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<ExpressionRelationFieldName>,
}
