use super::{bulk::Bulk, DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::{
    allele::{Allele, AlleleFieldName},
    filter::{FilterGroup, FilterQueryBuilder},
    gene::{Gene, GeneFieldName},
};

use anyhow::Result;
use sqlx::{QueryBuilder, Row, Sqlite};

impl InnerDbState {
    pub async fn get_alleles(&self) -> Result<Vec<Allele>, DbError> {
        match sqlx::query_as!(
            Allele,
            "
            SELECT name, contents, systematic_gene_name, variation_name FROM alleles ORDER BY name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(db_conds) => Ok(db_conds),
            Err(e) => {
                eprint!("Get alleles error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_alleles(
        &self,
        filter: &FilterGroup<AlleleFieldName>,
    ) -> Result<Vec<Allele>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT name, contents, systematic_gene_name, variation_name FROM alleles",
        );
        filter.add_filtered_query(&mut qb, true);
        match qb
            .build_query_as::<Allele>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().collect()),
            Err(e) => {
                eprint!("Get Filtered Allele error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_alleles_with_gene_filter(
        &self,
        allele_filter: &FilterGroup<AlleleFieldName>,
        gene_filter: &FilterGroup<GeneFieldName>,
    ) -> Result<Vec<(Allele, Gene)>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT name, contents, systematic_gene_name, variation_name, 
            systematic_name, descriptive_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end 
            FROM alleles 
            LEFT JOIN genes 
            ON systematic_gene_name IS systematic_name 
            ",
        );

        if !allele_filter.filters.is_empty() || !gene_filter.filters.is_empty() {
            qb.push(" WHERE ");
        }
        allele_filter.add_filtered_query(&mut qb, false);

        if !allele_filter.filters.is_empty() && !gene_filter.filters.is_empty() {
            qb.push(" OR ");
        }
        gene_filter.add_filtered_query(&mut qb, false);

        match qb.build().fetch_all(&self.conn_pool).await {
            Ok(exprs) => {
                let tuples: Vec<(Allele, Gene)> = exprs
                    .into_iter()
                    .map(|row| {
                        let a = Allele {
                            name: row.get(0),
                            contents: row.get(1),
                            systematic_gene_name: row.get(2),
                            variation_name: row.get(3),
                        };
                        let g = Gene {
                            systematic_name: row.get(4),
                            descriptive_name: row.get(5),
                            chromosome: row.get::<Option<String>, _>(6).map(|v: String| v.into()),
                            phys_loc: row.get::<Option<i64>, _>(7).map(|v| v as i32),
                            gen_loc: row.get(8),
                            recomb_suppressor: match (
                                row.get::<Option<i64>, _>(9),
                                row.get::<Option<i64>, _>(10),
                            ) {
                                (Some(start), Some(end)) => Some((start as i32, end as i32)),
                                _ => None,
                            },
                        };
                        (a, g)
                    })
                    .collect();

                Ok(tuples)
            }

            // Ok(exprs.into_iter().collect()),
            Err(e) => {
                eprint!("Get Filtered Allele error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_allele(&self, allele: &Allele) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO alleles (name, contents, systematic_gene_name, variation_name)
            VALUES($1, $2, $3, $4)
            ",
            allele.name,
            allele.contents,
            allele.systematic_gene_name,
            allele.variation_name,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Allele error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_alleles(&self, bulk: Bulk<Allele>) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "INSERT INTO alleles (name, contents, systematic_gene_name, variation_name) ",
        );
        if !bulk.errors.is_empty() {
            return Err(DbError::BulkInsert(format!(
                "Found errors on {} lines",
                bulk.errors.len()
            )));
        }
        let bind_limit = SQLITE_BIND_LIMIT / 4;
        if bulk.data.len() > bind_limit {
            return Err(DbError::BulkInsert(format!(
                "Row count exceeds max: {}",
                bind_limit
            )));
        }
        qb.push_values(bulk.data, |mut b, item| {
            b.push_bind(item.name)
                .push_bind(item.contents)
                .push_bind(item.systematic_gene_name)
                .push_bind(item.variation_name);
        });

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Bulk Insert error: {e}");
                Err(DbError::BulkInsert(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {
    use std::io::BufReader;

    use crate::dummy::testdata;
    use crate::interface::bulk::Bulk;
    use crate::models::allele::AlleleFieldName;
    use crate::models::chromosome::Chromosome;
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::models::gene::GeneFieldName;
    use crate::models::{allele::Allele, gene::Gene, variation_info::VariationInfo};
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_alleles tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let alleles = state.get_alleles().await?;
        let expected = testdata::get_alleles();
        assert_eq!(alleles, expected);
        Ok(())
    }
    /* #endregion */

    /* #region insert_allele tests */
    #[sqlx::test]
    async fn test_insert_allele_with_gene(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let alleles = state.get_alleles().await?;
        assert_eq!(alleles.len(), 0);
        let genes = state.get_genes().await?;
        assert_eq!(genes.len(), 0);

        let new_gene = Gene {
            systematic_name: "T14B4.7".to_string(),
            descriptive_name: Some("dpy-10".to_string()),
            chromosome: Some(Chromosome::Ii),
            phys_loc: Some(6710149),
            gen_loc: Some(0.0),
            recomb_suppressor: None,
        };

        state.insert_gene(&new_gene).await?;
        let genes = state.get_genes().await?;
        assert_eq!(vec![new_gene], genes);

        let expected = Allele {
            name: "cn64".to_string(),
            contents: None,
            systematic_gene_name: Some("T14B4.7".to_string()),
            variation_name: None,
        };

        state.insert_allele(&expected).await?;

        let alleles = state.get_alleles().await?;
        assert_eq!(vec![expected], alleles);
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_allele_with_variation(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let alleles = state.get_alleles().await?;
        assert_eq!(alleles.len(), 0);
        let vis = state.get_variation_info().await?;
        assert_eq!(vis.len(), 0);

        let new_vi = VariationInfo {
            allele_name: "oxTi302".to_string(),
            chromosome: Some(Chromosome::I),
            phys_loc: Some(10166146),
            gen_loc: Some(4.72),
            recomb_suppressor: None,
        };

        state.insert_variation_info(&new_vi).await?;
        let vis = state.get_variation_info().await?;
        assert_eq!(vec![new_vi], vis);

        let expected = Allele {
            name: "oxTi302".to_string(),
            contents: Some("[Peft-3::mCherry; cbr-unc-119(+)]".to_string()),
            systematic_gene_name: None,
            variation_name: Some("oxTi302".to_string()),
        };

        state.insert_allele(&expected).await?;

        let alleles = state.get_alleles().await?;
        assert_eq!(vec![expected], alleles);
        Ok(())
    }

    /// Tests foreign key constraint for gene_name
    #[sqlx::test]
    #[should_panic]
    async fn test_insert_allele_missing_gene(pool: Pool<Sqlite>) {
        let state = InnerDbState { conn_pool: pool };

        let expected = Allele {
            name: "cn64".to_string(),
            contents: None,
            systematic_gene_name: Some("T14B4.7".to_string()),
            variation_name: None,
        };

        state.insert_allele(&expected).await.unwrap();
    }

    /// Tests foreign key constraint for variation_name
    #[sqlx::test]
    #[should_panic]
    async fn test_insert_allele_missing_variation(pool: Pool<Sqlite>) {
        let state = InnerDbState { conn_pool: pool };

        let expected = Allele {
            name: "oxTi302".to_string(),
            contents: Some("[Peft-3::mCherry; cbr-unc-119(+)]".to_string()),
            systematic_gene_name: None,
            variation_name: Some("oxTi302".to_string()),
        };

        state.insert_allele(&expected).await.unwrap();
    }
    /* #endregion insert_allele tests */

    #[sqlx::test]
    async fn test_insert_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let new_gene = Gene {
            systematic_name: "T14B4.7".to_string(),
            descriptive_name: Some("dpy-10".to_string()),
            chromosome: Some(Chromosome::Ii),
            phys_loc: Some(6710149),
            gen_loc: Some(0.0),
            recomb_suppressor: None,
        };

        state.insert_gene(&new_gene).await?;

        let new_vi = VariationInfo {
            allele_name: "oxTi302".to_string(),
            chromosome: Some(Chromosome::I),
            phys_loc: Some(10166146),
            gen_loc: Some(4.72),
            recomb_suppressor: None,
        };

        state.insert_variation_info(&new_vi).await?;

        let csv_str = "name,contents,sysGeneName,variationName
cn64,,T14B4.7,
oxTi302,[Peft-3::mCherry; cbr-unc-119(+)],,oxTi302"
            .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new().has_headers(true).from_reader(buf);
        let bulk: Bulk<Allele> = Bulk::from_reader(&mut reader);

        state.insert_alleles(bulk).await?;

        let expected = vec![
            Allele {
                name: "cn64".to_string(),
                contents: None,
                systematic_gene_name: Some("T14B4.7".to_string()),
                variation_name: None,
            },
            Allele {
                name: "oxTi302".to_string(),
                contents: Some("[Peft-3::mCherry; cbr-unc-119(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxTi302".to_string()),
            },
        ];

        assert_eq!(expected, state.get_alleles().await?);
        Ok(())
    }

    /* #region get_filtered_alleles tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_alleles(&FilterGroup::<AlleleFieldName> {
                filters: vec![vec![
                    (
                        AlleleFieldName::SysGeneName,
                        Filter::Equal("F27D9.1".to_owned()),
                    ),
                    (
                        AlleleFieldName::SysGeneName,
                        Filter::Equal("T14B4.7".to_owned()),
                    ),
                ]],
                order_by: vec![(AlleleFieldName::Name, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_alleles());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles_no_results(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_alleles(&FilterGroup::<AlleleFieldName> {
                filters: vec![vec![(
                    AlleleFieldName::Name,
                    Filter::Equal("non-existant-allele".to_owned()),
                )]],
                order_by: vec![],
            })
            .await?;

        assert_eq!(exprs, vec![]);
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles_not_null_contents(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_alleles(&FilterGroup::<AlleleFieldName> {
                filters: vec![vec![(AlleleFieldName::Contents, Filter::NotNull)]],
                order_by: vec![(AlleleFieldName::Name, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::get_alleles_with_content());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles_not_null_contents_desc(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_alleles(&FilterGroup::<AlleleFieldName> {
                filters: vec![vec![(AlleleFieldName::Contents, Filter::NotNull)]],
                order_by: vec![(AlleleFieldName::Name, Order::Desc)],
            })
            .await?;
        let mut alleles = testdata::get_alleles_with_content();
        alleles.reverse();
        assert_eq!(exprs, alleles);
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles_null_contents(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_alleles(&FilterGroup::<AlleleFieldName> {
                filters: vec![vec![(AlleleFieldName::Contents, Filter::Null)]],
                order_by: vec![(AlleleFieldName::Name, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::get_alleles_with_null_content());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_allele_by_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_alleles(&FilterGroup::<AlleleFieldName> {
                filters: vec![vec![(
                    AlleleFieldName::Name,
                    Filter::Like("oxEx".to_string()),
                )]],
                order_by: vec![(AlleleFieldName::Name, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::search_alleles_by_name());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_alleles_with_gene_filter */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles_with_gene_filter(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let allele_filter = &FilterGroup::<AlleleFieldName> {
            filters: vec![vec![(AlleleFieldName::Name, Filter::Like("ed".to_owned()))]],
            order_by: vec![],
        };

        let gene_filter = &FilterGroup::<GeneFieldName> {
            filters: vec![vec![(
                GeneFieldName::DescName,
                Filter::Like("unc-18".to_string()),
            )]],
            order_by: vec![],
        };

        let exprs = state
            .get_filtered_alleles_with_gene_filter(allele_filter, gene_filter)
            .await?;

        assert_eq!(exprs, testdata::get_filtered_alleles_and_filtered_genes());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles_with_empty_gene_filter(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let allele_filter = &FilterGroup::<AlleleFieldName> {
            filters: vec![vec![(AlleleFieldName::Name, Filter::Like("ed".to_owned()))]],
            order_by: vec![],
        };

        let gene_filter = &FilterGroup::<GeneFieldName> {
            filters: vec![],
            order_by: vec![],
        };

        let exprs = state
            .get_filtered_alleles_with_gene_filter(allele_filter, gene_filter)
            .await?;

        assert_eq!(exprs, testdata::get_filtered_alleles_with_no_gene_filter());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles_with_gene_filter_and_empty_allele_filter(
        pool: Pool<Sqlite>,
    ) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let allele_filter = &FilterGroup::<AlleleFieldName> {
            filters: vec![],
            order_by: vec![],
        };

        let gene_filter = &FilterGroup::<GeneFieldName> {
            filters: vec![vec![(
                GeneFieldName::DescName,
                Filter::Like("unc-11".to_string()),
            )]],
            order_by: vec![],
        };

        let exprs = state
            .get_filtered_alleles_with_gene_filter(allele_filter, gene_filter)
            .await?;

        assert_eq!(
            exprs,
            testdata::get_filtered_alleles_and_filtered_genes_no_allele_filter()
        );
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_alleles_with_gene_filter_with_both_empty_filters(
        pool: Pool<Sqlite>,
    ) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let allele_filter = &FilterGroup::<AlleleFieldName> {
            filters: vec![],
            order_by: vec![],
        };

        let gene_filter = &FilterGroup::<GeneFieldName> {
            filters: vec![],
            order_by: vec![],
        };

        let exprs = state
            .get_filtered_alleles_with_gene_filter(allele_filter, gene_filter)
            .await?;

        assert_eq!(exprs, testdata::get_alleles_with_genes());
        Ok(())
    }
    /* #endregion */
}
