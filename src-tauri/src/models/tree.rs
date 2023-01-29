use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::FieldNameEnum;

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/db_Tree.ts")]
#[serde(rename = "db_Tree")]
pub struct Tree {
    pub id: i64,
    pub name: String,
    #[serde(rename = "lastEdited")]
    pub last_edited: String,
    pub data: String,
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_TreeFieldName.ts")]
pub enum TreeFieldName {
    Id,
    Name,
    LastEdited,
    Data,
}

impl FieldNameEnum for TreeFieldName {
    fn get_col_name(&self) -> String {
        match self {
            TreeFieldName::Id => "id".to_owned(),
            TreeFieldName::Name => "name".to_owned(),
            TreeFieldName::LastEdited => "last_edited".to_owned(),
            TreeFieldName::Data => "data".to_owned(),
        }
    }
}
