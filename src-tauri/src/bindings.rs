use crate::models::gene::Gene;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};
use thiserror::Error;

#[derive(Error, Debug, Serialize, Deserialize)]
pub enum SqlQueryError {
    #[error("Failed to execute query: {0}")]
    SqlQueryError(String),
}

pub struct InnerDbState {
    pub conn_pool: Pool<Sqlite>,
}

impl InnerDbState {
    pub async fn get_genes(&self) -> Result<Vec<Gene>, SqlQueryError> {
        match sqlx::query_as!(
            Gene,
            "
            select name, chromosome, phys_loc, gen_loc from genes order by name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(genes) => Ok(genes),
            Err(e) => {
                eprint!("Get genes error: {e}");
                Err(SqlQueryError::SqlQueryError(e.to_string()))
            }
        }
    }
    pub async fn insert_gene(&self, gene: Gene) -> Result<(), SqlQueryError> {
        match sqlx::query!(
            "INSERT INTO genes (name, chromosome, phys_loc, gen_loc)
            VALUES($1, $2, $3, $4)
            ",
            gene.name,
            gene.chromosome,
            gene.phys_loc,
            gene.gen_loc
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Gene error: {e}");
                Err(SqlQueryError::SqlQueryError(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {
    use crate::dummy::testdata;
    use crate::models::gene::Gene;
    use crate::InnerDbState;
    use anyhow::Result;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut genes: Vec<Gene> = state.get_genes().await?;
        genes.sort_by(|a, b| (a.name.cmp(&b.name)));

        assert_eq!(genes, testdata::get_genes());
        Ok(())
    }
}
