use anyhow::Result;
use serde::{Deserialize, Serialize};
use sqlx::{
    Pool, Sqlite,
};
use crate::models::gene::Gene;
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
    // pub async fn get_genes(&self) -> Result<Vec<Gene>, SqlQueryError> {
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
        // return Ok(Vec::new());
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

#[sqlx::test(fixtures("dummy"))]
async fn test_get_genes(pool: Pool<Sqlite>) -> Result<()> {
    let state = InnerDbState { conn_pool: pool };

    let mut genes: Vec<Gene> = state.get_genes().await?;
    genes.sort_by(|a, b| (a.name.cmp(&b.name)));
    let expected_genes = vec![
        Gene {
            name: "dpy-10".to_string(),
            chromosome: Some("II".to_string()),
            phys_loc: Some(6710149),
            gen_loc: Some(0.0),
        },
        Gene {
            name: "lin-15B".to_string(),
            chromosome: Some("X".to_string()),
            phys_loc: Some(15726123),
            gen_loc: Some(22.95),
        },
        Gene {
            name: "ox1059".to_string(),
            chromosome: Some("IV".to_string()),
            phys_loc: Some(11425742),
            gen_loc: Some(4.98),
        },
        Gene {
            name: "unc-119".to_string(),
            chromosome: Some("III".to_string()),
            phys_loc: Some(10902641),
            gen_loc: Some(5.59),
        },
        Gene {
            name: "unc-18".to_string(),
            chromosome: Some("X".to_string()),
            phys_loc: Some(7682896),
            gen_loc: Some(-1.35),
        },
    ];
    assert_eq!(genes, expected_genes);
    Ok(())
}
