use std::collections::HashMap;

use sqlx::{QueryBuilder, Sqlite};

use crate::models::filters::special_filter::{SpecialFilter, SpecialFilterType};

pub trait FilterQueryBuilder {
    fn add_filtered_query(&self, query: &mut QueryBuilder<Sqlite>);
}

pub fn generic_get_where_clause(
    qb: &mut QueryBuilder<Sqlite>,
    filters: HashMap<String, Vec<String>>,
    special_filters: HashMap<String, &Vec<SpecialFilter>>,
) {
    if filters.is_empty() && special_filters.is_empty() {
        return; //early exit
    }

    qb.push(" WHERE ");
    let mut qb_separated = qb.separated(" AND ");

    // Buiild: <col_name> IN (<val1>, <val2>, ...)
    for (col_name, values) in filters {
        let mut sub_query: QueryBuilder<Sqlite> = QueryBuilder::new(col_name + " IN ( '");
        let mut sub_separated = sub_query.separated("', '");
        for value in values.iter() {
            sub_separated.push(value);
        }
        sub_separated.push_unseparated("' ) ");
        qb_separated.push(sub_query.sql());
    }

    // Build: special filter clauses -- i.e. <col-name> IS NULL
    for (col_name, sp_filters) in special_filters {
        for filter in sp_filters {
            let cn = col_name.to_owned();
            let filter_clause = match filter.filter_type {
                SpecialFilterType::GreaterThan => cn + " > " + &filter.col_value,
                SpecialFilterType::LessThan => cn + " < " + &filter.col_value,
                SpecialFilterType::GreaterThanOrEqual => cn + " >= " + &filter.col_value,
                SpecialFilterType::LessThanOrEqual => cn + " <= " + &filter.col_value,
                SpecialFilterType::Null => cn + " IS NULL",
                SpecialFilterType::NotNull => cn + " IS NOT NULL",
                SpecialFilterType::True => cn + " IS 1",
                SpecialFilterType::False => cn + " IS 0",
            };
            qb_separated.push(filter_clause);
        }
    }

    qb_separated.push_unseparated(" ");
}

pub fn generic_get_order_by_clause(qb: &mut QueryBuilder<Sqlite>, order_by: Vec<String>) {
    if !order_by.is_empty() {
        qb.push(" ORDER BY ");
        let mut qb_separated = qb.separated(", ");

        for order_val in order_by {
            qb_separated.push(order_val);
        }

        qb_separated.push_unseparated(" ");
    }
}

pub fn generic_add_filtered_query(
    query: &mut QueryBuilder<Sqlite>,
    filters: HashMap<String, Vec<String>>,
    special_filters: HashMap<String, &Vec<SpecialFilter>>,
    order_by: Vec<String>,
) {
    generic_get_where_clause(query, filters, special_filters);
    generic_get_order_by_clause(query, order_by);
}
