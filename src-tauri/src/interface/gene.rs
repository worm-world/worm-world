use crate::models::{
    gene::Gene,
};
use super::{InnerDbState, DbError};
use anyhow::Result;

impl InnerDbState {
    pub async fn get_genes(&self) -> Result<Vec<Gene>, DbError> {
        match sqlx::query_as!(
            Gene,
            "
            SELECT name, chromosome, phys_loc, gen_loc FROM genes order by name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(genes) => Ok(genes),
            Err(e) => {
                eprint!("Get genes error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }
    pub async fn insert_gene(&self, gene: Gene) -> Result<(), DbError> {
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
                Err(DbError::SqlInsertError(e.to_string()))
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
