use super::FieldNameEnum;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, TS)]
#[ts(export, export_to = "../src/models/db/db_Gene.ts")]
#[serde(rename = "db_Gene")]
pub struct Gene {
    pub name: String,
    pub chromosome: Option<String>,
    #[serde(rename = "physLoc")]
    pub phys_loc: Option<i64>,
    #[serde(rename = "geneticLoc")]
    pub gen_loc: Option<f64>,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_GeneFieldName.ts")]
pub enum GeneFieldName {
    Name,
    Chromosome,
    PhysLoc,
    GeneticLoc,
}

impl FieldNameEnum for GeneFieldName {
    fn get_col_name(self: &GeneFieldName) -> String {
        match self {
            GeneFieldName::Name => "name".to_owned(),
            GeneFieldName::Chromosome => "chromosome".to_owned(),
            GeneFieldName::PhysLoc => "phys_loc".to_owned(),
            GeneFieldName::GeneticLoc => "gen_loc".to_owned(),
        }
    }
}
