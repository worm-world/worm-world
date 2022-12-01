use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_FilterRange.ts")]
pub struct FilterRange {
    #[serde(rename = "fieldValue")]
    pub col_value: String,
    #[serde(rename = "rangeType")]
    pub range_type: RangeType,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_RangeType.ts")]
pub enum RangeType {
    LessThan,
    GreaterThan,
}
