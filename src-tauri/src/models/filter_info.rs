use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/db_FilterInfo.ts")]
pub struct FilterInfo {
    pub filters: Vec<FilterKeyValue>,
    #[serde(rename = "orderBy")]
    pub order_by: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export, export_to = "../src/models/db/db_FilterKeyValue.ts")]
pub struct FilterKeyValue {
    #[serde(rename = "dbKey")]
    pub db_key: String,
    #[serde(rename = "dbValue")]
    pub db_value: String,
}
