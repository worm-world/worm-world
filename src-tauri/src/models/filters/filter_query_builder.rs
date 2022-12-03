use std::collections::HashMap;

use crate::models::filters::special_filter::{SpecialFilter, SpecialFilterType};

pub trait FilterQueryBuilder {
    fn get_filtered_query(&self) -> String;
}

pub fn generic_get_where_clause(
    filters: HashMap<String, Vec<String>>,
    special_filters: HashMap<String, &Vec<SpecialFilter>>,
) -> String {
    if filters.is_empty() && special_filters.is_empty() {
        return String::new(); //early exit
    }

    let mut statements: Vec<String> = Vec::new();

    for (col_name, values) in filters {
        let in_clause = col_name + " IN ( '" + &values.join("', '") + "' )";
        statements.push(in_clause);
    }

    for (col_name, sp_filters) in special_filters {
        for filter in sp_filters {
            let cn = col_name.to_owned();
            let filter_clause = match filter.filter_type {
                SpecialFilterType::GreaterThan => cn + " > " + &filter.col_value,
                SpecialFilterType::LessThan => cn + " < " + &filter.col_value,
                SpecialFilterType::GreaterThanOrEqual => cn + " >= " + &filter.col_value,
                SpecialFilterType::LessThanOrEqual => cn + " <= " + &filter.col_value,
                SpecialFilterType::Null => cn + " IS NULL ",
                SpecialFilterType::NotNull => cn + " IS NOT NULL ",
                SpecialFilterType::True => cn + " IS 1 ",
                SpecialFilterType::False => cn + " IS 0 ",
            };
            statements.push(filter_clause);
        }
    }

    " WHERE ".to_owned() + &statements.join(" AND ")
}

pub fn generic_get_order_by_clause(order_by: Vec<String>) -> String {
    if order_by.is_empty() {
        return String::new();
    }

    " ORDER BY ".to_owned() + &order_by.join(", ")
}

pub fn generic_get_filtered_query(
    filters: HashMap<String, Vec<String>>,
    special_filters: HashMap<String, &Vec<SpecialFilter>>,
    order_by: Vec<String>,
) -> String {
    generic_get_where_clause(filters, special_filters)
        + &generic_get_order_by_clause(order_by)
}
