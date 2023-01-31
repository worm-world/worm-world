use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::FieldNameEnum;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/db_Tree.ts")]
#[serde(rename = "db_Tree")]
pub struct Tree {
    pub id: String,
    pub name: String,
    #[serde(rename = "lastEdited")]
    pub last_edited: String,
    pub data: String,
    pub editable: bool,
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, Eq)]
pub struct TreeDb {
    pub id: String,
    pub name: String,
    #[serde(rename = "lastEdited")]
    pub last_edited: String,
    pub data: String,
    pub editable: i64,
}

impl From<TreeDb> for Tree {
    fn from(tree: TreeDb) -> Self {
        Tree {
            id: tree.id,
            name: tree.name,
            last_edited: tree.last_edited,
            data: tree.data,
            editable: tree.editable == 1,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/filter/db_TreeFieldName.ts")]
pub enum TreeFieldName {
    Id,
    Name,
    LastEdited,
    Data,
    Editable,
}

impl FieldNameEnum for TreeFieldName {
    fn get_col_name(&self) -> String {
        match self {
            TreeFieldName::Id => "id".to_owned(),
            TreeFieldName::Name => "name".to_owned(),
            TreeFieldName::LastEdited => "last_edited".to_owned(),
            TreeFieldName::Data => "data".to_owned(),
            TreeFieldName::Editable => "editable".to_owned(),
        }
    }
}
