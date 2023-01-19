use super::{DbError, InnerDbState};
use crate::models::filter::FilterQueryBuilder;
use crate::models::variation_info::VariationInfoDb;
use crate::models::{
    filter::Filter,
    variation_info::{VariationFieldName, VariationInfo},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_variation_info(&self) -> Result<Vec<VariationInfo>, DbError> {
        match sqlx::query_as!(
            VariationInfoDb,
            "
            SELECT allele_name, chromosome, phys_loc, gen_loc FROM variation_info ORDER BY allele_name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(vi) => Ok(vi.into_iter().map(|e| e.into()).collect()),
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
            .build_query_as::<VariationInfoDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Gene error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }
    pub async fn insert_variation_info(&self, vi: &VariationInfo) -> Result<(), DbError> {
        let chromosome = vi.chromosome.as_ref().map(|v| v.to_string());
        match sqlx::query!(
            "INSERT INTO variation_info (allele_name, chromosome, phys_loc, gen_loc)
            VALUES($1, $2, $3, $4)
            ",
            vi.allele_name,
            chromosome,
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
    use crate::models::chromosome::Chromosome;
    use crate::models::filter::{Filter, FilterType};
    use crate::models::variation_info::{VariationFieldName, VariationInfo};
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_variation tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_variation_info(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<VariationInfo> = state.get_variation_info().await?;
        assert_eq!(vis, testdata::get_variation_info());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_variation tests */
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

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_variation_gen_loc_range(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let filter = Filter::<VariationFieldName> {
            filters: vec![vec![(
                VariationFieldName::GenLoc,
                FilterType::Range("-1.46".to_string(), false, "4.72".to_string(), true),
            )]],
            order_by: vec![VariationFieldName::AlleleName],
        };
        let exprs = state.get_filtered_variation_info(&filter).await?;

        assert_eq!(exprs, testdata::get_filtered_variation_gen_loc_range());
        Ok(())
    }
    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_variation_by_allele_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let filter = Filter::<VariationFieldName> {
            filters: vec![vec![(
                VariationFieldName::AlleleName,
                FilterType::Like("IS".to_string()),
            )]],
            order_by: vec![VariationFieldName::AlleleName],
        };
        let exprs = state.get_filtered_variation_info(&filter).await?;

        assert_eq!(exprs, testdata::search_variation_by_allele_name());
        Ok(())
    }
    /* #endregion */

    /* #region insert_variation tests */
    #[sqlx::test]
    async fn test_insert_variation_info(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<VariationInfo> = state.get_variation_info().await?;
        assert_eq!(vis.len(), 0);

        let expected = VariationInfo {
            allele_name: "oxIs12".to_string(),
            chromosome: Some(Chromosome::X),
            phys_loc: None,
            gen_loc: None,
        };

        state.insert_variation_info(&expected).await?;
        let vis: Vec<VariationInfo> = state.get_variation_info().await?;

        assert_eq!(vec![expected], vis);
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_variation_info_no_chromosome(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<VariationInfo> = state.get_variation_info().await?;
        assert_eq!(vis.len(), 0);

        let expected = VariationInfo {
            allele_name: "oxIs12_no_chrom".to_string(),
            chromosome: None,
            phys_loc: None,
            gen_loc: None,
        };

        state.insert_variation_info(&expected).await?;
        let vis: Vec<VariationInfo> = state.get_variation_info().await?;

        assert_eq!(vec![expected], vis);
        Ok(())
    }
    /* #endregion */
}
