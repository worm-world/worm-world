use super::{
    filter_query_builder::{generic_get_filtered_query, FilterQueryBuilder},
    special_filter::SpecialFilter,
};
use crate::models::expr_relation::{get_col_name, ExpressionRelationFieldName};
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

impl FilterQueryBuilder for ExpressionRelationFilter {
    fn get_filtered_query(&self) -> String {
        let filters = &self.col_filters;
        let special_filters = &self.col_special_filters;
        let order_by = &self.order_by;

        let generic_filters: HashMap<String, Vec<String>> = filters
            .iter()
            .map(|(field_name, values)| (get_col_name(field_name.to_owned()), values.to_owned()))
            .collect();

        let generic_special_filters: HashMap<String, &Vec<SpecialFilter>> = special_filters
            .iter()
            .map(|(field_name, values)| (get_col_name(field_name), values.to_owned()))
            .collect();

        let generic_order_by: Vec<String> = order_by
            .iter()
            .map(get_col_name)
            .collect();

        generic_get_filtered_query(
            generic_filters,
            generic_special_filters,
            generic_order_by,
        )
    }
}
