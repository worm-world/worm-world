use super::{bulk::Bulk, DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::{
    filter::{Count, FilterGroup, FilterQueryBuilder},
    gene::{Gene, GeneDb, GeneFieldName},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_genes(&self) -> Result<Vec<Gene>, DbError> {
        match sqlx::query_as!(
            GeneDb,
            "
            SELECT systematic_name, descriptive_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end FROM genes ORDER BY descriptive_name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(genes) => Ok(genes.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get genes error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_genes(
        &self,
        filter: &FilterGroup<GeneFieldName>,
    ) -> Result<Vec<Gene>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT systematic_name, descriptive_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end FROM genes",
        );
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<GeneDb>()
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

    pub async fn get_count_filtered_genes(
        &self,
        filter: &FilterGroup<GeneFieldName>,
    ) -> Result<u32, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("SELECT COUNT(*) as count FROM genes");
        filter.add_filtered_query(&mut qb, true, false);

        match qb
            .build_query_as::<Count>()
            .fetch_one(&self.conn_pool)
            .await
        {
            Ok(count) => Ok(count.count),
            Err(e) => {
                eprint!("Get Filtered Gene Count error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_gene(&self, gene: &Gene) -> Result<(), DbError> {
        let (start, end): (Option<i32>, Option<i32>) = match gene.recomb_suppressor {
            Some(recomb_range) => (Some(recomb_range.0), Some(recomb_range.1)),
            None => (None, None),
        };

        let chromosome = gene.chromosome.as_ref().map(|v| v.to_string());
        match sqlx::query!(
            "INSERT INTO genes (systematic_name, descriptive_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end)
            VALUES(?, ?, ?, ?, ?, ?, ?)
            ",
            gene.systematic_name,
            gene.descriptive_name,
            chromosome,
            gene.phys_loc,
            gene.gen_loc,
            start,
            end
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Gene error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn insert_genes(&self, bulk: Bulk<GeneDb>) -> Result<(), DbError> {
        if !bulk.errors.is_empty() {
            return Err(DbError::BulkInsert(format!(
                "Found errors on {} lines",
                bulk.errors.len()
            )));
        }
        let bind_limit = SQLITE_BIND_LIMIT / 7;

        let mut data = bulk.data.into_iter().peekable();
        while data.peek().is_some() {
            let chunk = data.by_ref().take(bind_limit - 1).collect::<Vec<_>>();
            let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
                "INSERT OR IGNORE INTO genes (systematic_name, descriptive_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end) "
            );
            if chunk.len() > bind_limit {
                return Err(DbError::BulkInsert(format!(
                    "Row count exceeds max: {}",
                    bind_limit
                )));
            }
            qb.push_values(chunk, |mut b, item| {
                b.push_bind(item.systematic_name)
                    .push_bind(item.descriptive_name)
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

    pub async fn delete_filtered_genes(
        &self,
        filter: &FilterGroup<GeneFieldName>,
    ) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("DELETE FROM genes");
        filter.add_filtered_query(&mut qb, true, false);

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete Gene error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use std::io::BufReader;

    use crate::interface::bulk::Bulk;
    use crate::models::chromosome::Chromosome;
    use crate::models::filter::Order;
    use crate::models::gene::{Gene, GeneDb, GeneFieldName};
    use crate::InnerDbState;
    use crate::{
        interface::mock,
        models::filter::{Filter, FilterGroup},
    };
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut genes: Vec<Gene> = state.get_genes().await?;
        genes.sort_by(|a, b| (a.descriptive_name.cmp(&b.descriptive_name)));

        assert_eq!(genes, mock::gene::get_genes());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&FilterGroup::<GeneFieldName> {
                filters: vec![vec![
                    (GeneFieldName::Chromosome, Filter::Equal("X".to_string())),
                    (GeneFieldName::Chromosome, Filter::Equal("IV".to_string())),
                ]],
                order_by: vec![(GeneFieldName::DescName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::gene::get_filtered_genes());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_genes_alternate_ordering(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&FilterGroup::<GeneFieldName> {
                filters: vec![vec![
                    (GeneFieldName::Chromosome, Filter::Equal("X".to_string())),
                    (GeneFieldName::Chromosome, Filter::Equal("IV".to_string())),
                ]],
                order_by: vec![(GeneFieldName::SysName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::gene::get_filtered_genes_alternate_ordering());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_genes_and_clause(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&FilterGroup::<GeneFieldName> {
                filters: vec![
                    vec![(GeneFieldName::Chromosome, Filter::Equal("X".to_string()))],
                    vec![(GeneFieldName::PhysLoc, Filter::Equal("7682896".to_string()))],
                ],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::gene::get_filtered_genes_and_clause());
        Ok(())
    }
    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_genes_and_or_clause(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&FilterGroup::<GeneFieldName> {
                filters: vec![
                    vec![
                        (GeneFieldName::Chromosome, Filter::Equal("X".to_string())),
                        (
                            GeneFieldName::GeneticLoc,
                            Filter::GreaterThan("5".to_string(), true),
                        ),
                    ],
                    vec![
                        (GeneFieldName::PhysLoc, Filter::Equal("7682896".to_string())),
                        (
                            GeneFieldName::GeneticLoc,
                            Filter::GreaterThan("5".to_string(), true),
                        ),
                    ],
                ],
                order_by: vec![(GeneFieldName::DescName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::gene::get_filtered_genes_and_or_clause());
        Ok(())
    }
    #[sqlx::test(fixtures("full_db"))]
    async fn test_search_genes_by_desc_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&FilterGroup::<GeneFieldName> {
                filters: vec![vec![(
                    GeneFieldName::DescName,
                    Filter::Like("in".to_string()),
                )]],
                order_by: vec![(GeneFieldName::DescName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::gene::search_genes_by_desc_name());
        Ok(())
    }
    #[sqlx::test(fixtures("full_db"))]
    async fn test_search_genes_by_sys_or_desc_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&FilterGroup::<GeneFieldName> {
                filters: vec![vec![
                    (GeneFieldName::SysName, Filter::Like("T14".to_string())),
                    (GeneFieldName::DescName, Filter::Like("lin".to_string())),
                ]],
                order_by: vec![(GeneFieldName::DescName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::gene::search_genes_by_sys_or_desc_name());
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_gene(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let genes: Vec<Gene> = state.get_genes().await?;
        assert_eq!(genes.len(), 0);

        let expected = Gene {
            systematic_name: "M142.1".to_string(),
            descriptive_name: Some("unc-119".to_string()),
            chromosome: Some(Chromosome::Iii),
            phys_loc: Some(10902641),
            gen_loc: Some(5.59),
            recomb_suppressor: None,
        };

        state.insert_gene(&expected).await?;
        let genes: Vec<Gene> = state.get_genes().await?;

        assert_eq!(vec![expected], genes);
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_gene_no_chromosome(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let genes: Vec<Gene> = state.get_genes().await?;
        assert_eq!(genes.len(), 0);

        let expected = Gene {
            systematic_name: "FAKE23.4".to_string(),
            descriptive_name: Some("unc-new".to_string()),
            chromosome: None,
            phys_loc: Some(10902633),
            gen_loc: Some(6.78),
            recomb_suppressor: None,
        };

        state.insert_gene(&expected).await?;
        let genes: Vec<Gene> = state.get_genes().await?;

        assert_eq!(vec![expected], genes);
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let csv_str =
            "sysName,descName,chromosome,physLoc,geneticLoc,recombSuppressorStart,recombSuppressorEnd
M142.1,unc-119,III,10902641,5.59,,
FAKE23.4,unc-new,,10902633,6.78,,"
                .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new().has_headers(true).from_reader(buf);
        let bulk: Bulk<GeneDb> = Bulk::from_reader(&mut reader);

        state.insert_genes(bulk).await?;

        let genes: Vec<Gene> = state.get_genes().await?;
        assert_eq!(
            genes,
            vec![
                Gene {
                    systematic_name: "M142.1".to_string(),
                    descriptive_name: Some("unc-119".to_string()),
                    chromosome: Some(Chromosome::Iii),
                    phys_loc: Some(10902641),
                    gen_loc: Some(5.59),
                    recomb_suppressor: None,
                },
                Gene {
                    systematic_name: "FAKE23.4".to_string(),
                    descriptive_name: Some("unc-new".to_string()),
                    chromosome: None,
                    phys_loc: Some(10902633),
                    gen_loc: Some(6.78),
                    recomb_suppressor: None,
                }
            ]
        );
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_genes_tabs(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let csv_str =
            "sysName\tdescName\tchromosome\tphysLoc\tgeneticLoc\trecombSuppressorStart\trecombSuppressorEnd
M142.1\tunc-119\tIII\t10902641\t5.59\t\t
FAKE23.4\tunc-new\t\t10902633\t6.78\t\t"
                .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new()
            .has_headers(true)
            .delimiter(b'\t')
            .from_reader(buf);
        let bulk: Bulk<GeneDb> = Bulk::from_reader(&mut reader);

        state.insert_genes(bulk).await?;

        let genes: Vec<Gene> = state.get_genes().await?;
        assert_eq!(
            genes,
            vec![
                Gene {
                    systematic_name: "M142.1".to_string(),
                    descriptive_name: Some("unc-119".to_string()),
                    chromosome: Some(Chromosome::Iii),
                    phys_loc: Some(10902641),
                    gen_loc: Some(5.59),
                    recomb_suppressor: None,
                },
                Gene {
                    systematic_name: "FAKE23.4".to_string(),
                    descriptive_name: Some("unc-new".to_string()),
                    chromosome: None,
                    phys_loc: Some(10902633),
                    gen_loc: Some(6.78),
                    recomb_suppressor: None,
                }
            ]
        );
        Ok(())
    }

    #[sqlx::test]
    async fn test_delete_single_gene(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        // prep with single gene
        let gene = Gene {
            systematic_name: "T14B4.7".to_string(),
            descriptive_name: Some("dpy-10".to_string()),
            chromosome: Some(Chromosome::Ii),
            phys_loc: Some(6710149),
            gen_loc: Some(0.0),
            recomb_suppressor: None,
        };
        state.insert_gene(&gene).await?;

        let mut genes: Vec<Gene> = state.get_genes().await?;
        assert_eq!(genes.len(), 1);

        state
            .delete_filtered_genes(&FilterGroup::<GeneFieldName> {
                filters: vec![vec![(
                    GeneFieldName::SysName,
                    Filter::Equal("T14B4.7".to_string()),
                )]],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        genes = state.get_genes().await?;
        assert_eq!(genes.len(), 0);
        Ok(())
    }

    #[sqlx::test]

    async fn test_delete_filtered_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        // prep with single gene
        for gene in mock::gene::get_genes().iter() {
            state.insert_gene(gene).await?;
        }

        let mut genes: Vec<Gene> = state.get_genes().await?;
        let orig_len = genes.len();
        assert_eq!(orig_len, mock::gene::get_genes().len());

        let filter = &FilterGroup::<GeneFieldName> {
            filters: vec![vec![(
                GeneFieldName::Chromosome,
                Filter::Equal(Chromosome::X.to_string()),
            )]],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        genes = state.get_filtered_genes(filter).await?;
        let filtered_len = genes.len();
        assert!(filtered_len > 0);

        state.delete_filtered_genes(filter).await?;
        genes = state.get_genes().await?;

        assert_eq!(genes.len(), orig_len - filtered_len);

        Ok(())
    }

    #[sqlx::test]
    async fn test_delete_all_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        // prep with single gene
        for gene in mock::gene::get_genes().iter() {
            state.insert_gene(gene).await?;
        }

        let mut genes: Vec<Gene> = state.get_genes().await?;
        assert_eq!(genes.len(), mock::gene::get_genes().len());

        let filter = &FilterGroup::<GeneFieldName> {
            filters: vec![],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        state.delete_filtered_genes(filter).await?;
        genes = state.get_genes().await?;

        assert_eq!(genes.len(), 0);

        Ok(())
    }
}
