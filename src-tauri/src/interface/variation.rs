use super::bulk::Bulk;
use super::{DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::filter::{Count, FilterQueryBuilder};
use crate::models::variation::VariationDb;
use crate::models::{
    filter::FilterGroup,
    variation::{Variation, VariationFieldName},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_variations(&self) -> Result<Vec<Variation>, DbError> {
        match sqlx::query_as!(
            VariationDb,
            "
            SELECT allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end FROM variations ORDER BY allele_name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(v) => Ok(v.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get variations info error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }
    pub async fn get_filtered_variations(
        &self,
        filter: &FilterGroup<VariationFieldName>,
    ) -> Result<Vec<Variation>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end FROM variations",
        );
        filter.add_filtered_query(&mut qb, true, true);
        match qb
            .build_query_as::<VariationDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Variation Info error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_count_filtered_variations(
        &self,
        filter: &FilterGroup<VariationFieldName>,
    ) -> Result<u32, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT COUNT(*) as count FROM variations");
        filter.add_filtered_query(&mut qb, true, false);

        match qb
            .build_query_as::<Count>()
            .fetch_one(&self.conn_pool)
            .await
        {
            Ok(count) => Ok(count.count),
            Err(e) => {
                eprint!("Get Filtered Variation Info Count error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_variation(&self, v: &Variation) -> Result<(), DbError> {
        let chromosome = v.chromosome.as_ref().map(|v| v.to_string());
        let (start, end): (Option<i32>, Option<i32>) = match v.recomb_suppressor {
            Some(recomb_range) => (Some(recomb_range.0), Some(recomb_range.1)),
            None => (None, None),
        };
        match sqlx::query!(
            "INSERT INTO variations (allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end)
            VALUES(?, ?, ?, ?, ?, ?)
            ",
            v.allele_name,
            chromosome,
            v.phys_loc,
            v.gen_loc,
            start,
            end
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert variation error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn insert_variations(&self, bulk: Bulk<VariationDb>) -> Result<(), DbError> {
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
                "INSERT OR IGNORE INTO variations (allele_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end) "
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
                    eprint!("Bulk insert error: {e}");
                    return Err(DbError::BulkInsert(e.to_string()));
                }
            }
        }
        Ok(())
    }

    pub async fn delete_filtered_variations(
        &self,
        filter: &FilterGroup<VariationFieldName>,
    ) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("DELETE FROM variations");
        filter.add_filtered_query(&mut qb, true, false);

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete variations error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use std::io::BufReader;

    use crate::interface::bulk::Bulk;
    use crate::interface::mock;
    use crate::models::chromosome_name::ChromosomeName;
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::models::variation::{Variation, VariationDb, VariationFieldName};
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_variations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<Variation> = state.get_variations().await?;
        assert_eq!(vis, mock::variation::get_variations());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_variations(pool: Pool<Sqlite>) -> Result<()> {
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
        let exprs = state.get_filtered_variations(&filter).await?;

        assert_eq!(exprs, mock::variation::get_filtered_variations());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
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
        let exprs = state.get_filtered_variations(&filter).await?;

        assert_eq!(
            exprs,
            mock::variation::get_filtered_variations_gen_loc_range()
        );
        Ok(())
    }
    #[sqlx::test(fixtures("full_db"))]
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
        let exprs = state.get_filtered_variations(&filter).await?;

        assert_eq!(exprs, mock::variation::search_variation_by_allele_name());
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_variation(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<Variation> = state.get_variations().await?;
        assert_eq!(vis.len(), 0);

        let expected = Variation {
            allele_name: "oxIs12".to_string(),
            chromosome: Some(ChromosomeName::X),
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        };

        state.insert_variation(&expected).await?;
        let vis: Vec<Variation> = state.get_variations().await?;

        assert_eq!(vec![expected], vis);
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_variation_no_chromosome(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<Variation> = state.get_variations().await?;
        assert_eq!(vis.len(), 0);

        let expected = Variation {
            allele_name: "oxIs12_no_chrom".to_string(),
            chromosome: None,
            phys_loc: None,
            gen_loc: None,
            recomb_suppressor: None,
        };

        state.insert_variation(&expected).await?;
        let vis: Vec<Variation> = state.get_variations().await?;

        assert_eq!(vec![expected], vis);
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_variations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let vis: Vec<Variation> = state.get_variations().await?;
        assert_eq!(vis.len(), 0);

        let expected = vec![
            Variation {
                allele_name: "fake".to_string(),
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
            Variation {
                allele_name: "oxIs12".to_string(),
                chromosome: Some(ChromosomeName::X),
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            },
            Variation {
                allele_name: "oxIs13".to_string(),
                chromosome: Some(ChromosomeName::X),
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
        let bulk: Bulk<VariationDb> = Bulk::from_reader(&mut reader);

        state.insert_variations(bulk).await?;
        let vis: Vec<Variation> = state.get_variations().await?;

        assert_eq!(expected, vis);
        Ok(())
    }

    #[sqlx::test(fixtures("variation"))]
    async fn test_delete_single_variations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let mut variation: Vec<Variation> = state.get_variations().await?;
        assert_eq!(variation.len(), mock::variation::get_variations().len());

        let delete_filter = &FilterGroup::<VariationFieldName> {
            filters: vec![vec![(
                VariationFieldName::AlleleName,
                Filter::Equal("oxEx219999".to_string()),
            )]],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        state.delete_filtered_variations(delete_filter).await?;

        variation = state.get_variations().await?;
        assert_eq!(variation.len(), mock::variation::get_variations().len() - 1);

        variation = state.get_filtered_variations(delete_filter).await?;
        assert_eq!(variation.len(), 0);

        Ok(())
    }

    #[sqlx::test(fixtures("variation"))]
    async fn test_delete_filtered_variations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut variation: Vec<Variation> = state.get_variations().await?;
        let orig_len = variation.len();
        assert_eq!(orig_len, mock::variation::get_variations().len());

        let filter = &FilterGroup::<VariationFieldName> {
            filters: vec![vec![(VariationFieldName::Chromosome, Filter::Null)]],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        variation = state.get_filtered_variations(filter).await?;
        let filtered_len = variation.len();
        assert!(filtered_len > 0);

        state.delete_filtered_variations(filter).await?;
        variation = state.get_variations().await?;

        assert_eq!(variation.len(), orig_len - filtered_len);
        assert_eq!(state.get_filtered_variations(filter).await?.len(), 0);

        Ok(())
    }

    #[sqlx::test(fixtures("variation"))]
    async fn test_delete_all_variations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut variation: Vec<Variation> = state.get_variations().await?;
        assert_eq!(variation.len(), mock::variation::get_variations().len());

        let filter = &FilterGroup::<VariationFieldName> {
            filters: vec![],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        state.delete_filtered_variations(filter).await?;
        variation = state.get_variations().await?;

        assert_eq!(variation.len(), 0);

        Ok(())
    }
}
