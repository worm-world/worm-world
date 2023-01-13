use super::{chromosome::Chromosome, FieldNameEnum};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_Gene.ts")]
#[serde(rename = "db_Gene")]
pub struct Gene {
    #[serde(rename = "sysName")]
    pub systematic_name: String,
    #[serde(rename = "descName")]
    pub descriptive_name: Option<String>,
    pub chromosome: Option<Chromosome>,
    #[serde(rename = "physLoc")]
    pub phys_loc: Option<i64>,
    #[serde(rename = "geneticLoc")]
    pub gen_loc: Option<f64>,
}

impl From<GeneDb> for Gene {
    fn from(item: GeneDb) -> Gene {
        Gene {
            systematic_name: item.systematic_name,
            descriptive_name: item.descriptive_name,
            chromosome: item.chromosome.map(|v| v.into()),
            phys_loc: item.phys_loc,
            gen_loc: item.gen_loc,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow)]
pub struct GeneDb {
    #[serde(rename = "sysName")]
    pub systematic_name: String,
    #[serde(rename = "descName")]
    pub descriptive_name: Option<String>,
    pub chromosome: Option<String>,
    #[serde(rename = "physLoc")]
    pub phys_loc: Option<i64>,
    #[serde(rename = "geneticLoc")]
    pub gen_loc: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_GeneFieldName.ts")]
pub enum GeneFieldName {
    SysName,
    DescName,
    Chromosome,
    PhysLoc,
    GeneticLoc,
}

impl FieldNameEnum for GeneFieldName {
    fn get_col_name(self: &GeneFieldName) -> String {
        match self {
            GeneFieldName::SysName => "systematic_name".to_owned(),
            GeneFieldName::DescName => "descriptive_name".to_owned(),
            GeneFieldName::Chromosome => "chromosome".to_owned(),
            GeneFieldName::PhysLoc => "phys_loc".to_owned(),
            GeneFieldName::GeneticLoc => "gen_loc".to_owned(),
        }
    }
}
