use super::{bulk::Bulk, DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::{
    filter::{Count, FilterGroup, FilterQueryBuilder},
    strain_allele::{StrainAllele, StrainAlleleDb, StrainAlleleFieldName},
};

use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_strain_alleles(&self) -> Result<Vec<StrainAllele>, DbError> {
        match sqlx::query_as!(
            StrainAlleleDb,
            "
            SELECT strain_name, allele_name, is_on_top, is_on_bot FROM strain_alleles ORDER BY strain_name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(strain_alleles) => Ok(strain_alleles.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get strain alleles error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_strain_alleles(
        &self,
        filter: &FilterGroup<StrainAlleleFieldName>,
    ) -> Result<Vec<StrainAllele>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT strain_name, allele_name, is_on_top, is_on_bot from strain_alleles",
        );
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<StrainAllele>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().collect()),
            Err(e) => {
                eprint!("Get filtered strain alleles error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_count_filtered_strain_alleles(
        &self,
        filter: &FilterGroup<StrainAlleleFieldName>,
    ) -> Result<u32, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT COUNT(*) as count FROM strain_alleles");
        filter.add_filtered_query(&mut qb, true, false);

        match qb
            .build_query_as::<Count>()
            .fetch_one(&self.conn_pool)
            .await
        {
            Ok(count) => Ok(count.count),
            Err(e) => {
                eprint!("Get filtered strain alleles count error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_strain_allele(&self, strain_allele: &StrainAllele) -> Result<(), DbError> {
        match sqlx::query!(
            "
            INSERT INTO strain_alleles (strain_name, allele_name, is_on_top, is_on_bot)
            VALUES (?, ?, ?, ?)
            ",
            strain_allele.strain_name,
            strain_allele.allele_name,
            strain_allele.is_on_top,
            strain_allele.is_on_bot,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert strain allele error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn insert_strain_alleles(&self, bulk: Bulk<StrainAllele>) -> Result<(), DbError> {
        if !bulk.errors.is_empty() {
            return Err(DbError::BulkInsert(format!(
                "Found errors on {} lines",
                bulk.errors.first().unwrap().1
            )));
        }
        let bind_limit = SQLITE_BIND_LIMIT / 4;

        let mut data = bulk.data.into_iter().peekable();
        while data.peek().is_some() {
            let chunk = data.by_ref().take(bind_limit - 1).collect::<Vec<_>>();
            let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
                "INSERT OR IGNORE INTO strain_alleles (strain_name, allele_name, is_on_top, is_on_bot)",
            );
            if chunk.len() > bind_limit {
                return Err(DbError::BulkInsert(format!(
                    "Row count exceeds max: {}",
                    bind_limit
                )));
            }
            qb.push_values(chunk, |mut b, item| {
                b.push_bind(item.strain_name)
                    .push_bind(item.allele_name)
                    .push_bind(item.is_on_top)
                    .push_bind(item.is_on_bot);
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

    pub async fn delete_filtered_strain_alleles(
        &self,
        filter: &FilterGroup<StrainAlleleFieldName>,
    ) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("DELETE FROM strain_alleles");
        filter.add_filtered_query(&mut qb, true, false);

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete strain allele error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {
    use std::io::BufReader;

    use crate::interface::bulk::Bulk;
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::models::strain_allele::StrainAllele;
    use crate::InnerDbState;
    use crate::{interface::mock, models::strain_allele::StrainAlleleFieldName};
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_strain_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let strain_alleles: Vec<StrainAllele> = state.get_strain_alleles().await?;
        assert_eq!(strain_alleles, mock::strain_allele::get_strain_alleles());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_strain_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_strain_alleles(&FilterGroup::<StrainAlleleFieldName> {
                filters: vec![vec![(
                    StrainAlleleFieldName::AlleleName,
                    Filter::Equal("ed3".to_string()),
                )]],
                order_by: vec![(StrainAlleleFieldName::StrainName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::strain_allele::get_filtered_strain_alleles());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_strain_alleles_many_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_strain_alleles(&FilterGroup::<StrainAlleleFieldName> {
                filters: vec![vec![
                    (
                        StrainAlleleFieldName::AlleleName,
                        Filter::Equal("oxTi75".to_string()),
                    ),
                    (
                        StrainAlleleFieldName::AlleleName,
                        Filter::Equal("cn64".to_string()),
                    ),
                    (
                        StrainAlleleFieldName::AlleleName,
                        Filter::Equal("ox11000".to_string()),
                    ),
                    (
                        StrainAlleleFieldName::AlleleName,
                        Filter::Equal("ed3".to_string()),
                    ),
                ]],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(
            exprs,
            mock::strain_allele::get_filtered_strain_alleles_many_alleles()
        );
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_strain_alleles_and_or_clause(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_strain_alleles(&FilterGroup::<StrainAlleleFieldName> {
                filters: vec![
                    vec![(
                        StrainAlleleFieldName::AlleleName,
                        Filter::Equal("ed3".to_string()),
                    )],
                    vec![
                        (
                            StrainAlleleFieldName::StrainName,
                            Filter::Like("BT".to_string()),
                        ),
                        (
                            StrainAlleleFieldName::StrainName,
                            Filter::Like("EG507".to_string()),
                        ),
                    ],
                ],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(
            exprs,
            mock::strain_allele::get_filtered_strain_alleles_and_or_clause()
        );
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_count_filtered_strain_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let count = state
            .get_count_filtered_strain_alleles(&FilterGroup::<StrainAlleleFieldName> {
                filters: vec![],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;
        assert_eq!(
            count as usize,
            mock::strain_allele::get_strain_alleles().len()
        );
        Ok(())
    }

    #[sqlx::test(fixtures("strain", "allele"))]
    async fn test_insert_strain_allele(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let strain_alleles: Vec<StrainAllele> = state.get_strain_alleles().await?;
        assert_eq!(strain_alleles.len(), 0);

        let expected = StrainAllele {
            strain_name: "CB128".to_string(),
            allele_name: "e128".to_string(),
            is_on_top: true,
            is_on_bot: true,
        };

        state.insert_strain_allele(&expected).await?;
        let strain_alleles: Vec<StrainAllele> = state.get_strain_alleles().await?;

        assert_eq!(vec![expected], strain_alleles);
        Ok(())
    }

    #[sqlx::test(fixtures("allele", "strain"))]
    async fn test_insert_strain_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let csv_str =
            "strainName,alleleName,isOnTop,isOnBot\nEG6207,ed3,true,true\nMT2495,n744,true,true\nTN64,cn64,true,true"
                .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new().has_headers(true).from_reader(buf);
        let bulk: Bulk<StrainAllele> = Bulk::from_reader(&mut reader);

        state.insert_strain_alleles(bulk).await?;

        let strain_alleles: Vec<StrainAllele> = state.get_strain_alleles().await?;
        assert_eq!(
            strain_alleles,
            vec![
                StrainAllele {
                    strain_name: "EG6207".to_string(),
                    allele_name: "ed3".to_string(),
                    is_on_top: true,
                    is_on_bot: true,
                },
                StrainAllele {
                    strain_name: "MT2495".to_string(),
                    allele_name: "n744".to_string(),
                    is_on_top: true,
                    is_on_bot: true,
                },
                StrainAllele {
                    strain_name: "TN64".to_string(),
                    allele_name: "cn64".to_string(),
                    is_on_top: true,
                    is_on_bot: true,
                },
            ]
        );
        Ok(())
    }

    #[sqlx::test(fixtures("strain", "allele"))]
    async fn test_insert_strain_alleles_tabs(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let tsv_str =
            "strainName\talleleName\tisOnTop\tisOnBot\nEG6207\ted3\ttrue\ttrue\nMT2495\tn744\ttrue\ttrue\nTN64\tcn64\ttrue\ttrue"
                .as_bytes();
        let buf = BufReader::new(tsv_str);
        let mut reader = csv::ReaderBuilder::new()
            .has_headers(true)
            .delimiter(b'\t')
            .from_reader(buf);
        let bulk: Bulk<StrainAllele> = Bulk::from_reader(&mut reader);

        state.insert_strain_alleles(bulk).await?;

        let strain_alleles: Vec<StrainAllele> = state.get_strain_alleles().await?;
        assert_eq!(
            strain_alleles,
            vec![
                StrainAllele {
                    strain_name: "EG6207".to_string(),
                    allele_name: "ed3".to_string(),
                    is_on_top: true,
                    is_on_bot: true,
                },
                StrainAllele {
                    strain_name: "MT2495".to_string(),
                    allele_name: "n744".to_string(),
                    is_on_top: true,
                    is_on_bot: true,
                },
                StrainAllele {
                    strain_name: "TN64".to_string(),
                    allele_name: "cn64".to_string(),
                    is_on_top: true,
                    is_on_bot: true,
                },
            ]
        );
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]

    async fn test_delete_filtered_strain_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut strain_alleles: Vec<StrainAllele> = state.get_strain_alleles().await?;
        let orig_len = strain_alleles.len();
        assert_eq!(orig_len, mock::strain_allele::get_strain_alleles().len());

        let filter = &FilterGroup::<StrainAlleleFieldName> {
            filters: vec![vec![(
                StrainAlleleFieldName::AlleleName,
                Filter::Equal("ed3".to_string()),
            )]],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        strain_alleles = state.get_filtered_strain_alleles(filter).await?;
        let filtered_len = strain_alleles.len();
        assert!(filtered_len > 0);

        state.delete_filtered_strain_alleles(filter).await?;
        strain_alleles = state.get_strain_alleles().await?;

        assert_eq!(strain_alleles.len(), orig_len - filtered_len);

        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_delete_all_strain_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut strain_alleles: Vec<StrainAllele> = state.get_strain_alleles().await?;
        assert_eq!(
            strain_alleles.len(),
            mock::strain_allele::get_strain_alleles().len()
        );

        let filter = &FilterGroup::<StrainAlleleFieldName> {
            filters: vec![],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        state.delete_filtered_strain_alleles(filter).await?;
        strain_alleles = state.get_strain_alleles().await?;

        assert_eq!(strain_alleles.len(), 0);

        Ok(())
    }
}
