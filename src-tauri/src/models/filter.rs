use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use sqlx::{QueryBuilder, Sqlite};
use ts_rs::TS;

pub trait FilterQueryBuilder {
    fn add_filtered_query(&self, query: &mut QueryBuilder<Sqlite>);
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/Order.ts")]
pub enum Order {
    Asc,
    Desc,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/Filter.ts")]
pub enum Filter {
    /// the left value to compare to, bool is whether it's inclusive, right is the same
    Range(String, bool, String, bool),
    /// the value to compare to, bool is whether it's inclusive
    LessThan(String, bool),
    /// the value to compare to, bool is whether it's inclusive
    GreaterThan(String, bool),
    Equal(String),
    NotEqual(String),
    /// searches all entries that contain the string
    Like(String),
    Null,
    NotNull,
    True,
    False,
}
impl Filter {
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
            Self::Like(a) => {
                qb.push(" LIKE ");
                qb.push_bind(format!("%{}%", a.to_owned()));
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
#[ts(export_to = "../src/models/db/filter/FilterGroup.ts")]
pub struct FilterGroup<T>
where
    T: TS + std::cmp::Eq + std::hash::Hash,
{
    /**
     * Nested vectors allow AND / OR statements
     * To create chained OR statements: add tuples in the INNER-MOST vectors
     * To create chained AND statements: add multiple vectors with a single tuple in each
     * To create mixed AND / OR statements: any combination of the above 2 lines
     *
     * -----------------------------------------------
     *
     * For example:
     * [
     *   [(col1, val1), (col2, val2), (col3, val3)]
     * ]
     *
     * ^ would generate: WHERE (col1 == val1 OR col2 == val2 OR col3 == val3);
     *
     * -----------------------------------------------
     *
     * [
     *   [(col1, val1)],
     *   [(col1, val2)],
     *   [(col2, val3)],
     * ]
     *
     * ^ would generate: WHERE (col1 == val1) AND (col1 == val2) AND (col2 == val3);
     *
     * -----------------------------------------------
     *
     * [
     *   [(col1, val1), (col2, val2), (col3, val3)],
     *   [(col1, val1), (col4, val4)],
     *   [(col5, val5)],
     * ]
     *
     * ^ would generate: WHERE (col1 == val1 OR col2 == val2 OR col3 == val3) AND
     *                         (col1 == val1 OR col4 == val4) AND
     *                         (col5 == val5);
     */
    pub filters: Vec<Vec<(T, Filter)>>,
    #[serde(rename = "orderBy")]
    pub order_by: Vec<(T, Order)>,
}

impl<T: FieldNameEnum> FilterQueryBuilder for FilterGroup<T> {
    fn add_filtered_query(&self, qb: &mut QueryBuilder<Sqlite>) {
        if !self.filters.is_empty() {
            // WHERE
            qb.push(" WHERE \n");

            // all comparisons
            for (i, inner_filters) in self.filters.iter().enumerate() {
                if i > 0 {
                    qb.push(" AND ");
                }

                qb.push(" ( ");
                for (j, (field_name, filter)) in inner_filters.iter().enumerate() {
                    if j > 0 {
                        qb.push(" OR ");
                    }
                    let col_name = field_name.get_col_name();
                    filter.add_to_query(&col_name, qb);
                }
                qb.push(" ) \n");
            }
        }

        // ORDER BY
        if !self.order_by.is_empty() {
            qb.push(" ORDER BY ");
            let mut qb_separated = qb.separated(", ");
            for (order_field, order_dir) in self.order_by.iter() {
                let order_dir_str = match order_dir {
                    Order::Asc => "ASC",
                    Order::Desc => "DESC",
                };
                qb_separated.push(format!("{} COLLATE NOCASE {}", order_field.get_col_name(), order_dir_str));
            }
            qb_separated.push_unseparated(" ");
        }
        // DEBUG (uncomment line below)
        // println!("{}", qb.sql());
    }
}
