use super::{DbError, InnerDbState};
use crate::models::filter::FilterQueryBuilder;
use crate::models::{
    filter::Filter,
    variation_info::{VariationFieldName, VariationInfo},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

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

    pub async fn get_filtered_variation_info(
        &self,
        filter: &Filter<VariationFieldName>,
    ) -> Result<Vec<VariationInfo>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT allele_name, chromosome, phys_loc, gen_loc FROM variation_info",
        );
        filter.add_filtered_query(&mut qb);
        match qb
            .build_query_as::<VariationInfo>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().collect()),
            Err(e) => {
                eprint!("Get Filtered Gene error: {e}");
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
    use crate::models::filter::{Filter, FilterType};
    use crate::models::variation_info::{VariationFieldName, VariationInfo};
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

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_variation_info(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let filter = Filter::<VariationFieldName> {
            filters: vec![vec![
                (VariationFieldName::PhysLoc, FilterType::NotNull),
                (VariationFieldName::Chromosome, FilterType::NotNull),
            ]],
            order_by: vec![
                VariationFieldName::AlleleName,
                VariationFieldName::Chromosome,
            ],
        };
        let exprs = state.get_filtered_variation_info(&filter).await?;

        assert_eq!(exprs, testdata::get_filtered_variation_info());
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
