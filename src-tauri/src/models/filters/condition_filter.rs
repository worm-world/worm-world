use super::{
    filter_query_builder::{generic_get_filtered_query, FilterQueryBuilder},
    special_filter::SpecialFilter,
};
use crate::models::condition::{get_col_name, ConditionFieldName};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_ConditionFilter.ts")]
pub struct ConditionFilter {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    #[ts(type = "Map<ConditionFieldName, string[]>")]
    pub col_filters: HashMap<ConditionFieldName, Vec<String>>,
    #[serde(rename = "fieldSpecialFilters")]
    #[ts(type = "Map<ConditionFieldName, SpecialFilter[]>")]
    pub col_special_filters: HashMap<ConditionFieldName, Vec<SpecialFilter>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<ConditionFieldName>,
}

impl FilterQueryBuilder for ConditionFilter {
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
