use std::collections::HashMap;

use crate::models::filters::special_filter::{SpecialFilter, SpecialFilterType};

pub fn generic_get_where_clause(
    filters: HashMap<String, &Vec<String>>,
    special_filters: HashMap<String, &Vec<SpecialFilter>>,
) -> String {
    if filters.is_empty() && special_filters.is_empty() {
        return String::new(); //early exit
    }

    let mut statements: Vec<String> = Vec::new();

    for (col_name, values) in filters {
        let in_clause = col_name.to_owned() + " IN ( '" + &values.join("', '") + "' )";
        statements.push(in_clause);
    }

    for (col_name, sp_filters) in special_filters {
        for filter in sp_filters {
            if filter.filter_type == SpecialFilterType::GreaterThan {
                let filter_clause = col_name.to_owned() + " > " + &filter.col_value;
                statements.push(filter_clause)
            } else if filter.filter_type == SpecialFilterType::GreaterThanOrEqual {
                let filter_clause = col_name.to_owned() + " >= " + &filter.col_value;
                statements.push(filter_clause)
            } else if filter.filter_type == SpecialFilterType::LessThan {
                let filter_clause = col_name.to_owned() + " < " + &filter.col_value;
                statements.push(filter_clause)
            } else if filter.filter_type == SpecialFilterType::LessThanOrEqual {
                let filter_clause = col_name.to_owned() + " <= " + &filter.col_value;
                statements.push(filter_clause)
            } else if filter.filter_type == SpecialFilterType::Null {
                let filter_clause = col_name.to_owned() + " IS NULL ";
                statements.push(filter_clause)
            } else if filter.filter_type == SpecialFilterType::NotNull {
                let filter_clause = col_name.to_owned() + " IS NOT NULL " + &filter.col_value;
                statements.push(filter_clause)
            } else if filter.filter_type == SpecialFilterType::True {
                let filter_clause = col_name.to_owned() + " IS 1 " + &filter.col_value;
                statements.push(filter_clause)
            } else if filter.filter_type == SpecialFilterType::False {
                let filter_clause = col_name.to_owned() + " IS 0 " + &filter.col_value;
                statements.push(filter_clause)
            }
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
