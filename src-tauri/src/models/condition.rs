use serde::{Deserialize, Serialize};
use ts_rs::TS;
#[derive(Serialize, Deserialize, Debug, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_Condition.ts")]
pub struct Condition {
    pub name: String,
    pub description: Option<String>,
    #[serde(rename = "maleMating")]
    pub male_mating: Option<i64>,
    pub lethal: Option<bool>,
    #[serde(rename = "femaleSterile")]
    pub female_sterile: Option<bool>,
    pub arrested: Option<bool>,
    #[serde(rename = "maturationDays")]
    pub maturation_days: Option<f64>,
}

// This whole section is necessary since SQLite has no boolean type.
// Like C, it's just integers with values 0 and 1. We want to cast all of those to booleans.

impl From<ConditionDb> for Condition {
    fn from(item: ConditionDb) -> Self {
        Condition {
            name: item.name,
            description: item.description,
            male_mating: item.male_mating,
            lethal: item.lethal.map(|v| v == 1),
            female_sterile: item.female_sterile.map(|v| v == 1),
            arrested: item.arrested.map(|v| v == 1),
            maturation_days: item.maturation_days,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct ConditionDb {
    pub name: String,
    pub description: Option<String>,
    pub male_mating: Option<i64>,
    // bool
    pub lethal: Option<i64>,
    // bool
    pub female_sterile: Option<i64>,
    // bool
    pub arrested: Option<i64>,
    pub maturation_days: Option<f64>,
}
