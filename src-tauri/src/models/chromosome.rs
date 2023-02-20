use std::str::FromStr;

use serde::{Deserialize, Serialize};
use strum_macros::Display;
use strum_macros::EnumString;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS, EnumString, Display)]
#[ts(export, export_to = "../src/models/db/filter/db_ChromosomeEnum.ts")]
pub enum Chromosome {
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
    #[strum(serialize = "Ex")]
    Ex,
}

impl From<String> for Chromosome {
    fn from(to_convert: String) -> Self {
        Chromosome::from_str(to_convert.as_str()).unwrap()
    }
}
