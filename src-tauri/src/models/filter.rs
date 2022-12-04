use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use sqlx::{QueryBuilder, Sqlite};
use std::collections::HashMap;
use ts_rs::TS;

pub trait FilterQueryBuilder {
    fn add_filtered_query(&self, query: &mut QueryBuilder<Sqlite>);
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_SpecialFilter.ts")]
pub struct SpecialFilter {
    #[serde(rename = "fieldValue")]
    pub col_value: String,
    #[serde(rename = "specialFilterType")]
    pub filter_type: SpecialFilterType,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_SpecialFilterType.ts")]
pub enum SpecialFilterType {
    LessThan,
    LessThanOrEqual,
    GreaterThan,
    GreaterThanOrEqual,
    Null,
    NotNull,
    True,
    False,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export_to = "../src/models/db/filter/db_Filter.ts")]
pub struct Filter<T: TS + std::cmp::Eq + std::hash::Hash> {
    // map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    pub col_filters: HashMap<T, Vec<String>>,
    #[serde(rename = "fieldSpecialFilters")]
    pub col_special_filters: HashMap<T, Vec<SpecialFilter>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<T>,
}

impl<T: FieldNameEnum> FilterQueryBuilder for Filter<T> {
    fn add_filtered_query(&self, qb: &mut QueryBuilder<Sqlite>) {
        let filters = &self.col_filters;
        let special_filters = &self.col_special_filters;
        let order_by = &self.order_by;

        // WHERE
        if filters.is_empty() && special_filters.is_empty() {
            return; //early exit
        }

        qb.push(" WHERE ");
        let mut qb_separated = qb.separated(" AND ");

        // Buiild: <col_name> IN (<val1>, <val2>, ...)
        for (field_name, values) in filters {
            let mut sub_query: QueryBuilder<Sqlite> =
                QueryBuilder::new(field_name.get_col_name() + " IN ( '");
            let mut sub_separated = sub_query.separated("', '");
            for value in values.iter() {
                sub_separated.push(value);
            }
            sub_separated.push_unseparated("' ) ");
            qb_separated.push(sub_query.sql());
        }

        // Build: special filter clauses -- i.e. <col-name> IS NULL
        for (field_name, sp_filters) in special_filters {
            for filter in sp_filters {
                let cn = field_name.get_col_name();
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

        // ORDER BY
        if !order_by.is_empty() {
            qb.push(" ORDER BY ");
            let mut qb_separated = qb.separated(", ");

            for order_field in order_by {
                qb_separated.push(order_field.get_col_name());
            }

            qb_separated.push_unseparated(" ");
        }
    }
}
