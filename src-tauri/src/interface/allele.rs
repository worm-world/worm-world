// use crate::models::{
//     allele::Allele
// };
// use super::{InnerDbState, DbError};
// use anyhow::Result;

// impl InnerDbState {
//     pub async fn get_alleles(&self) -> Result<Vec<Allele>, DbError> {
//         Err(DbError::SqlQueryError("Allele unimplememented".to_string()))
//     }
//     pub async fn insert_allele(&self, allele: &Allele) -> Result<(), DbError> {
//         Err(DbError::SqlInsertError("Allele unimplemented".to_string()))
//     }
// }

// #[cfg(test)]
// mod test {
//     use crate::dummy::testdata;
//     use crate::models::allele::Allele;
//     use crate::InnerDbState;
//     use anyhow::Result;
//     use sqlx::{Pool, Sqlite};
//     use pretty_assertions::{assert_eq};

//     #[sqlx::test(fixtures("dummy"))]
//     async fn test_get_alleles(pool: Pool<Sqlite>) -> Result<()> {
//         let state = InnerDbState { conn_pool: pool };
//         // TODO: implement
//         Ok(())
//     }
//     #[sqlx::test(fixtures("dummy"))]
//     async fn test_insert_allele(pool: Pool<Sqlite>) -> Result<()> {
//         let state = InnerDbState { conn_pool: pool };
//         // TODO: implement
//         Ok(())
//     }
// }
