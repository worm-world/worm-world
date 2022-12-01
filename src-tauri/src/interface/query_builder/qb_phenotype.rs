use crate::models::{
    filters::{filter_range::RangeType, phenotype_filter::PhenotypeFilter},
    phenotype::get_col_name,
};

pub fn get_where_clause(filter: &PhenotypeFilter) -> String {
    if filter.col_filters.is_empty() && filter.col_ranges.is_empty() {
        return String::new(); //early exit
    }

    let mut statements: Vec<String> = Vec::new();

    for (field_name, values) in &filter.col_filters {
        let in_clause = get_col_name(field_name) + " IN ( '" + &values.join("', ") + "' )";
        statements.push(in_clause);
    }

    for (field_name, ranges) in &filter.col_ranges {
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

pub fn get_order_by_clause(filter: &PhenotypeFilter) -> String {
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
