use crate::models::filter_info::{get_col_name, FilterInfo, RangeType};

pub fn get_where_clause(filter_info: &FilterInfo) -> String {
    if filter_info.col_filters.is_empty() && filter_info.col_ranges.is_empty() {
        return String::new(); //early exit
    }

    let mut statements: Vec<String> = Vec::new();

    for (field_name, values) in &filter_info.col_filters {
        let in_clause = get_col_name(field_name) + " IN ( '" + &values.join("', ") + "' )";
        statements.push(in_clause);
    }

    for (field_name, ranges) in &filter_info.col_ranges {
        for range in ranges {
            if range.range_type == RangeType::GreaterThan {
                let range_clause = get_col_name(field_name) + " > " + &range.col_value;
                statements.push(range_clause)
            } else {
                let range_clause = get_col_name(field_name) + " < " + &range.col_value;
                statements.push(range_clause)
            }
        }
    }

    " WHERE ".to_owned() + &statements.join(" AND ")
}

pub fn get_order_by_clause(filter: &FilterInfo) -> String {
    if filter.order_by.is_empty() {
        return String::new();
    }

    return " ORDER BY ".to_owned()
        + &filter
            .order_by
            .iter()
            .map(get_col_name)
            .collect::<Vec<String>>()
            .join(", ");
}
