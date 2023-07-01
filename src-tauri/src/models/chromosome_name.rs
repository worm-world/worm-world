use serde::{Deserialize, Serialize};
use std::str::FromStr;
use strum_macros::Display;
use strum_macros::EnumString;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS, EnumString, Display)]
#[ts(export, export_to = "../src/models/db/filter/db_ChromosomeName.ts")]
pub enum ChromosomeName {
    #[strum(serialize = "I")]
    I,
    #[serde(rename = "II")]
    #[strum(serialize = "II")]
    Ii,
    #[serde(rename = "III")]
    #[strum(serialize = "III")]
    Iii,
    #[serde(rename = "IV")]
    #[strum(serialize = "IV")]
    Iv,
    #[strum(serialize = "V")]
    V,
    #[strum(serialize = "X")]
    X,
    #[serde(rename = "MtDNA")]
    MtDNA,
    #[strum(serialize = "Ex")]
    Ex,
}

impl From<String> for ChromosomeName {
    fn from(to_convert: String) -> Self {
        ChromosomeName::from_str(to_convert.as_str()).unwrap()
    }
}
