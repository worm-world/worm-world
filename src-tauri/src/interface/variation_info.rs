use super::bulk::Bulk;
use super::{DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::filter::FilterQueryBuilder;
use crate::models::variation_info::VariationInfoDb;
use crate::models::{
    filter::FilterGroup,
    variation_info::{VariationFieldName, VariationInfo},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_variation_info(&self) -> Result<Vec<VariationInfo>, DbError> {
        match sqlx::query_as!(
            VariationInfoDb,
            "
            SELECT allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end FROM variation_info ORDER BY allele_name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(vi) => Ok(vi.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get variation info error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }
    pub async fn get_filtered_variation_info(
        &self,
        filter: &FilterGroup<VariationFieldName>,
    ) -> Result<Vec<VariationInfo>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end FROM variation_info",
        );
        filter.add_filtered_query(&mut qb, true);
        match qb
            .build_query_as::<VariationInfoDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Gene error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }
    pub async fn insert_variation_info(&self, vi: &VariationInfo) -> Result<(), DbError> {
        let chromosome = vi.chromosome.as_ref().map(|v| v.to_string());
        let (start, end): (Option<i32>, Option<i32>) = match vi.recomb_suppressor {
            Some(recomb_range) => (Some(recomb_range.0), Some(recomb_range.1)),
            None => (None, None),
        };
        match sqlx::query!(
            "INSERT INTO variation_info (allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end)
            VALUES($1, $2, $3, $4, $5, $6)
            ",
            vi.allele_name,
            chromosome,
            vi.phys_loc,
            vi.gen_loc,
            start,
            end
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Variation info error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn insert_variation_infos(&self, bulk: Bulk<VariationInfoDb>) -> Result<(), DbError> {
        if !bulk.errors.is_empty() {
            return Err(DbError::BulkInsert(format!(
                "Found errors on {} lines",
                bulk.errors.len()
            )));
        }
        let bind_limit = SQLITE_BIND_LIMIT / 6;
        let mut data = bulk.data.into_iter().peekable();
        while data.peek().is_some() {
            let chunk = data.by_ref().take(bind_limit - 1).collect::<Vec<_>>();
            if chunk.len() > bind_limit {
                return Err(DbError::BulkInsert(format!(
                    "Row count exceeds max: {}",
                    bind_limit
                )));
            }
            let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
                "INSERT OR IGNORE INTO variation_info (allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end) "
            );
            qb.push_values(chunk, |mut b, item| {
                b.push_bind(item.allele_name)
                    .push_bind(item.chromosome)
                    .push_bind(item.phys_loc)
                    .push_bind(item.gen_loc)
                    .push_bind(item.recomb_suppressor_start)
                    .push_bind(item.recomb_suppressor_end);
            });

            match qb.build().execute(&self.conn_pool).await {
                Ok(_) => {}
                Err(e) => {
                    eprint!("Bulk Insert error: {e}");
                    return Err(DbError::BulkInsert(e.to_string()));
                }
            }
        }
        Ok(())
    }
}

#[cfg(test)]
mod test {

    use std::io::BufReader;

    use crate::dummy::testdata;
    use crate::interface::bulk::Bulk;
    use crate::models::chromosome::Chromosome;
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::models::variation_info::{VariationFieldName, VariationInfo, VariationInfoDb};
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
        let filter = FilterGroup::<VariationFieldName> {
            filters: vec![
                vec![(VariationFieldName::PhysLoc, Filter::NotNull)],
                vec![(VariationFieldName::Chromosome, Filter::NotNull)],
            ],
            order_by: vec![
                (VariationFieldName::AlleleName, Order::Asc),
                (VariationFieldName::Chromosome, Order::Asc),
            ],
            limit: None,
            offset: None,
        };
        let exprs = state.get_filtered_variation_info(&filter).await?;

        assert_eq!(exprs, testdata::get_filtered_variation_info());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_variation_gen_loc_range(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let filter = FilterGroup::<VariationFieldName> {
            filters: vec![vec![(
                VariationFieldName::GenLoc,
                Filter::Range("-1.46".to_string(), false, "4.72".to_string(), true),
            )]],
            order_by: vec![(VariationFieldName::AlleleName, Order::Asc)],
            limit: None,
            offset: None,
        };
        let exprs = state.get_filtered_variation_info(&filter).await?;

        assert_eq!(exprs, testdata::get_filtered_variation_gen_loc_range());
        Ok(())
    }
    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_variation_by_allele_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let filter = FilterGroup::<VariationFieldName> {
            filters: vec![vec![(
                VariationFieldName::AlleleName,
                Filter::Like("IS".to_string()),
            )]],
            order_by: vec![(VariationFieldName::AlleleName, Order::Asc)],
            limit: None,
            offset: None,
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
            recomb_suppressor: None,
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
            recomb_suppressor: None,
        };

        state.insert_variation_info(&expected).await?;
        let vis: Vec<VariationInfo> = state.get_variation_info().await?;

        assert_eq!(vec![expected], vis);
        Ok(())
    }
    /* #endregion */

    /* #region insert_variation_infos tests */
    #[sqlx::test]
    async fn test_insert_variation_infos(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<VariationInfo> = state.get_variation_info().await?;
        assert_eq!(vis.len(), 0);

        let expected = vec![
            VariationInfo {
                allele_name: "fake".to_string(),
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
            VariationInfo {
                allele_name: "oxIs12".to_string(),
                chromosome: Some(Chromosome::X),
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
            VariationInfo {
                allele_name: "oxIs13".to_string(),
                chromosome: Some(Chromosome::X),
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
        ];

        let csv_str =
            "alleleName,chromosome,physLoc,geneticLoc,recombSuppressorStart,recombSuppressorEnd
fake,,,,,
oxIs12,X,,,,
oxIs13,X,,,,"
                .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new().has_headers(true).from_reader(buf);
        let bulk: Bulk<VariationInfoDb> = Bulk::from_reader(&mut reader);

        state.insert_variation_infos(bulk).await?;
        let vis: Vec<VariationInfo> = state.get_variation_info().await?;

        assert_eq!(expected, vis);
        Ok(())
    }
}
