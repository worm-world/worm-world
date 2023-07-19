use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::FieldNameEnum;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, TS)]
#[ts(export, export_to = "../src/models/db/db_CrossDesign.ts")]
#[serde(rename = "db_CrossDesign")]
pub struct CrossDesign {
    pub id: String,
    pub name: String,
    #[serde(rename = "lastEdited")]
    pub last_edited: String,
    pub data: String,
    pub editable: bool,
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, PartialEq, Eq)]
pub struct CrossDesignDb {
    pub id: String,
    pub name: String,
    #[serde(rename = "lastEdited")]
    pub last_edited: String,
    pub data: String,
    pub editable: i64,
}

impl From<CrossDesignDb> for CrossDesign {
    fn from(cross_design: CrossDesignDb) -> Self {
        CrossDesign {
            id: cross_design.id,
            name: cross_design.name,
            last_edited: cross_design.last_edited,
            data: cross_design.data,
            editable: cross_design.editable == 1,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Hash, PartialEq, Eq, TS)]
#[ts(
    export,
    export_to = "../src/models/db/filter/db_CrossDesignFieldName.ts"
)]
pub enum CrossDesignFieldName {
    Id,
    Name,
    LastEdited,
    Data,
    Editable,
}

impl FieldNameEnum for CrossDesignFieldName {
    fn get_col_name(&self) -> String {
        match self {
            CrossDesignFieldName::Id => "id".to_owned(),
            CrossDesignFieldName::Name => "name".to_owned(),
            CrossDesignFieldName::LastEdited => "last_edited".to_owned(),
            CrossDesignFieldName::Data => "data".to_owned(),
            CrossDesignFieldName::Editable => "editable".to_owned(),
        }
    }
}
