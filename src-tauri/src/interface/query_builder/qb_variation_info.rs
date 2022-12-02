use std::collections::HashMap;

use crate::models::{
    filters::{special_filter::SpecialFilter, variation_info_filter::VariationInfoFilter},
    variation_info::get_col_name,
};

use super::generic_qb::{generic_get_order_by_clause, generic_get_where_clause};

pub fn get_where_clause(filter: &VariationInfoFilter) -> String {
    let mut generic_filters: HashMap<String, &Vec<String>> = HashMap::new();
    let mut generic_special_filters: HashMap<String, &Vec<SpecialFilter>> = HashMap::new();

    for (field_name, values) in filter.col_filters.iter() {
        generic_filters.insert(get_col_name(field_name), values);
    }

    for (field_name, special_filters) in filter.col_special_filters.iter() {
        generic_special_filters.insert(get_col_name(field_name), special_filters);
    }

    generic_get_where_clause(generic_filters, generic_special_filters)
}

pub fn get_order_by_clause(filter: &VariationInfoFilter) -> String {
    let order_by = filter.order_by.iter().map(get_col_name).collect();
    generic_get_order_by_clause(order_by)
}
