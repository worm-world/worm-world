use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_Phenotype.ts")]
#[serde(rename = "db_Phenotype")]
pub struct Phenotype {
    pub name: String,
    pub wild: bool,
    #[serde(rename = "shortName")]
    pub short_name: String,
    pub description: Option<String>,
    #[serde(rename = "maleMating")]
    pub male_mating: Option<i32>,
    pub lethal: Option<bool>,
    #[serde(rename = "femaleSterile")]
    pub female_sterile: Option<bool>,
    pub arrested: Option<bool>,
    #[serde(rename = "maturationDays")]
    pub maturation_days: Option<f64>,
}

// This whole section is necessary since SQLite has no boolean type.
// Like C, it's just integers with values 0 and 1. We want to cast all of those to booleans.

impl From<PhenotypeDb> for Phenotype {
    fn from(item: PhenotypeDb) -> Self {
        Phenotype {
            name: item.name,
            wild: item.wild == 1,
            short_name: item.short_name,
            description: item.description,
            male_mating: item.male_mating.map(|v| v as i32),
            lethal: item.lethal.map(|v| v == 1),
            female_sterile: item.female_sterile.map(|v| v == 1),
            arrested: item.arrested.map(|v| v == 1),
            maturation_days: item.maturation_days,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct PhenotypeDb {
    pub name: String,
    // bool
    pub wild: i64,
    pub short_name: String,
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

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_PhenotypeFieldName.ts")]
pub enum PhenotypeFieldName {
    Name,
    Wild,
    ShortName,
    Description,
    MaleMating,
    Lethal,
    FemaleSterile,
    Arrested,
    MaturationDays,
}
impl FieldNameEnum for PhenotypeFieldName {
    fn get_col_name(self: &PhenotypeFieldName) -> String {
        match self {
            PhenotypeFieldName::Name => "name".to_owned(),
            PhenotypeFieldName::Wild => "wild".to_owned(),
            PhenotypeFieldName::ShortName => "short_name".to_owned(),
            PhenotypeFieldName::Description => "description".to_owned(),
            PhenotypeFieldName::MaleMating => "male_mating".to_owned(),
            PhenotypeFieldName::Lethal => "lethal".to_owned(),
            PhenotypeFieldName::FemaleSterile => "female_sterile".to_owned(),
            PhenotypeFieldName::Arrested => "arrested".to_owned(),
            PhenotypeFieldName::MaturationDays => "maturation_days".to_owned(),
        }
    }
}
