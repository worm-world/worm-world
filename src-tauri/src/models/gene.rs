use super::{chromosome_name::ChromosomeName, FieldNameEnum};
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
    pub chromosome: Option<ChromosomeName>,
    #[serde(rename = "physLoc")]
    pub phys_loc: Option<i32>,
    #[serde(rename = "geneticLoc")]
    pub gen_loc: Option<f64>,
    #[serde(rename = "recombSuppressor")]
    pub recomb_suppressor: Option<(i32, i32)>,
}

impl From<GeneDb> for Gene {
    fn from(item: GeneDb) -> Gene {
        Gene {
            systematic_name: item.systematic_name,
            descriptive_name: item.descriptive_name,
            chromosome: item.chromosome.map(|v| v.into()),
            phys_loc: item.phys_loc.map(|v| v as i32),
            gen_loc: item.gen_loc,
            recomb_suppressor: match (item.recomb_suppressor_start, item.recomb_suppressor_end) {
                (Some(start), Some(end)) => Some((start as i32, end as i32)),
                _ => None,
            },
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
    #[serde(rename = "recombSuppressorStart")]
    pub recomb_suppressor_start: Option<i64>,
    #[serde(rename = "recombSuppressorEnd")]
    pub recomb_suppressor_end: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_GeneFieldName.ts")]
pub enum GeneFieldName {
    SysName,
    DescName,
    Chromosome,
    PhysLoc,
    GeneticLoc,
    RecombSuppressor,
}

impl FieldNameEnum for GeneFieldName {
    fn get_col_name(self: &GeneFieldName) -> String {
        match self {
            GeneFieldName::SysName => "systematic_name".to_owned(),
            GeneFieldName::DescName => "descriptive_name".to_owned(),
            GeneFieldName::Chromosome => "chromosome".to_owned(),
            GeneFieldName::PhysLoc => "phys_loc".to_owned(),
            GeneFieldName::GeneticLoc => "gen_loc".to_owned(),
            GeneFieldName::RecombSuppressor => "recomb_suppressor".to_owned(),
        }
    }
}
