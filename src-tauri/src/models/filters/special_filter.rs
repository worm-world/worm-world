use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_SpecialFilter.ts")]
pub struct SpecialFilter {
    #[serde(rename = "fieldValue")]
    pub col_value: String,
    #[serde(rename = "rangeType")]
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
