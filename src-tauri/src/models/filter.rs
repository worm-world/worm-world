use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use sqlx::{QueryBuilder, Sqlite};
use std::collections::HashMap;
use ts_rs::TS;

pub trait FilterQueryBuilder {
    fn add_filtered_query(&self, query: &mut QueryBuilder<Sqlite>);
}

// #[derive(Serialize, Deserialize, Debug, TS)]
// #[ts(export, export_to = "../src/models/db/filter/SpecialFilter.ts")]
// pub struct SpecialFilter {
//     #[serde(rename = "fieldValue")]
//     pub col_value: String,
//     #[serde(rename = "specialFilterType")]
//     pub filter_type: SpecialFilterType,
// }

// #[derive(Serialize, Deserialize, PartialEq, Eq, Debug, TS)]
// #[ts(export, export_to = "../src/models/db/filter/SpecialFilterType.ts")]
// pub enum SpecialFilterType {
//     LessThan,
//     LessThanOrEqual,
//     GreaterThan,
//     GreaterThanOrEqual,
//     Null,
//     NotNull,
//     True,
//     False,
// }

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/FilterType.ts")]
pub enum FilterType {
    /// the left value to compare to, bool is whether it's inclusive, right is the same
    Range(String, bool, String, bool),
    /// the value to compare to, bool is whether it's inclusive
    LessThan(String, bool),
    /// the value to compare to, bool is whether it's inclusive
    GreaterThan(String, bool),
    Equal(String),
    NotEqual(String),
    Null,
    NotNull,
    True,
    False,
}
impl FilterType {
    pub fn add_to_query(&self, col_name: &String, qb: &mut QueryBuilder<Sqlite>) {
        qb.push(col_name.to_owned());
        match self {
            Self::Range(a, a_inc, b, b_inc) => {
                qb.push(match a_inc.to_owned() {
                    true => " >= ",
                    false => " > ",
                });
                qb.push_bind(a.to_owned());
                qb.push(" AND ");
                qb.push(col_name.to_owned());
                qb.push(match b_inc.to_owned() {
                    true => " <= ",
                    false => " < ",
                });
                qb.push_bind(b.to_owned());
            }
            Self::GreaterThan(a, a_inc) => {
                qb.push(match a_inc.to_owned() {
                    true => " >= ",
                    false => " > ",
                });
                qb.push_bind(a.to_owned());
            }
            Self::LessThan(b, b_inc) => {
                qb.push(match b_inc.to_owned() {
                    true => " <= ",
                    false => " < ",
                });
                qb.push_bind(b.to_owned());
            }
            Self::Equal(a) => {
                qb.push(" = ");
                qb.push_bind(a.to_owned());
            }
            Self::NotEqual(a) => {
                qb.push(" != ");
                qb.push_bind(a.to_owned());
            }
            Self::Null => {
                qb.push(" IS NULL");
            }
            Self::NotNull => {
                qb.push(" IS NOT NULL");
            }
            Self::True => {
                qb.push(" = 1");
            }
            Self::False => {
                qb.push(" = 0");
            }
        };
        qb.push("\n");
    }
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export_to = "../src/models/db/filter/Filter.ts")]
pub struct Filter<T>
where
    T: TS + std::cmp::Eq + std::hash::Hash,
{
    /// map key is the fieldName, value is the list of filters for that col
    #[serde(rename = "fieldFilters")]
    pub col_filters: HashMap<T, Vec<FilterType>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<T>,
}

impl<T: FieldNameEnum> FilterQueryBuilder for Filter<T> {
    fn add_filtered_query(&self, qb: &mut QueryBuilder<Sqlite>) {
        if self.col_filters.is_empty() {
            return; //early exit
        }
        // WHERE
        qb.push(" WHERE \n");

        // all comparisons
        for (i, (field_name, filter_list)) in self.col_filters.iter().enumerate() {
            let col_name = field_name.get_col_name();
            if i > 0 {
                qb.push(" AND ");
            }
            for (j, f) in filter_list.iter().enumerate() {
                if j > 0 {
                    qb.push(" OR ");
                }
                f.add_to_query(&col_name, qb);
            }
        }

        qb.push(" \n");

        // ORDER BY
        if !self.order_by.is_empty() {
            qb.push(" ORDER BY ");
            let mut qb_separated = qb.separated(", ");
            for order_field in self.order_by.iter() {
                qb_separated.push(order_field.get_col_name());
            }
            qb_separated.push_unseparated(" ");
        }
    }
}
