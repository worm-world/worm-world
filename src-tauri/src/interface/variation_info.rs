use super::{DbError, InnerDbState};
use crate::models::variation_info::VariationInfo;
use anyhow::Result;

impl InnerDbState {
    pub async fn get_variation_info(&self) -> Result<Vec<VariationInfo>, DbError> {
        match sqlx::query_as!(
            VariationInfo,
            "
            SELECT allele_name, chromosome, phys_loc, gen_loc FROM variation_info ORDER BY allele_name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(vi) => Ok(vi),
            Err(e) => {
                eprint!("Get variation info error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }
    pub async fn insert_variation_info(&self, vi: &VariationInfo) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO variation_info (allele_name, chromosome, phys_loc, gen_loc)
            VALUES($1, $2, $3, $4)
            ",
            vi.allele_name,
            vi.chromosome,
            vi.phys_loc,
            vi.gen_loc
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Variation info error: {e}");
                Err(DbError::SqlInsertError(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {
    use crate::dummy::testdata;
    use crate::models::variation_info::VariationInfo;
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_variation_info(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<VariationInfo> = state.get_variation_info().await?;
        assert_eq!(vis, testdata::get_variation_info());
        Ok(())
    }
    #[sqlx::test]
    async fn test_insert_variation_info(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<VariationInfo> = state.get_variation_info().await?;
        assert_eq!(vis.len(), 0);

        let expected = VariationInfo {
            allele_name: "oxIs12".to_string(),
            chromosome: Some("X".to_string()),
            phys_loc: None,
            gen_loc: None,
        };

        state.insert_variation_info(&expected).await?;
        let vis: Vec<VariationInfo> = state.get_variation_info().await?;

        assert_eq!(vec![expected], vis);
        Ok(())
    }
}
