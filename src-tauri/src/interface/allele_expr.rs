use super::{bulk::Bulk, DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::{
    allele_expr::{AlleleExpression, AlleleExpressionDb, AlleleExpressionFieldName},
    filter::{Count, FilterGroup, FilterQueryBuilder},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

//select allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance from allele_exprs order by allele_name, expressing_phenotype_name, expressing_phenotype_wild
impl InnerDbState {
    pub async fn get_allele_exprs(&self) -> Result<Vec<AlleleExpression>, DbError> {
        match sqlx::query_as!(
            AlleleExpressionDb,
            "
            SELECT allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance 
            FROM allele_exprs 
            ORDER BY allele_name, expressing_phenotype_name, expressing_phenotype_wild
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Allele Exprs error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_allele_exprs(
        &self,
        filter: &FilterGroup<AlleleExpressionFieldName>,
    ) -> Result<Vec<AlleleExpression>, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance FROM allele_exprs");
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<AlleleExpressionDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Allele Exprs error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_count_filtered_allele_exprs(
        &self,
        filter: &FilterGroup<AlleleExpressionFieldName>,
    ) -> Result<u32, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT COUNT(*) as count FROM allele_exprs");
        filter.add_filtered_query(&mut qb, true, false);

        match qb
            .build_query_as::<Count>()
            .fetch_one(&self.conn_pool)
            .await
        {
            Ok(count) => Ok(count.count),
            Err(e) => {
                eprint!("Get Filtered Allele Exprs Count error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_allele_expr(&self, expr: &AlleleExpression) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO allele_exprs (allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance)
            VALUES(?, ?, ?, ?)
            ",
            expr.allele_name,
            expr.expressing_phenotype_name,
            expr.expressing_phenotype_wild,
            expr.dominance
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert AlleleExpr error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn insert_allele_exprs(&self, bulk: Bulk<AlleleExpressionDb>) -> Result<(), DbError> {
        if !bulk.errors.is_empty() {
            return Err(DbError::BulkInsert(format!(
                "Found errors on {} lines",
                bulk.errors.len()
            )));
        }
        let bind_limit = SQLITE_BIND_LIMIT / 4;
        let mut data = bulk.data.into_iter().peekable();
        while data.peek().is_some() {
            let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
                "INSERT OR IGNORE INTO allele_exprs (allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance) "
            );

            let chunk = data.by_ref().take(bind_limit - 1).collect::<Vec<_>>();
            if chunk.len() > bind_limit {
                return Err(DbError::BulkInsert(format!(
                    "Row count exceeds max: {}",
                    bind_limit
                )));
            }
            qb.push_values(chunk, |mut b, item| {
                b.push_bind(item.allele_name)
                    .push_bind(item.expressing_phenotype_name)
                    .push_bind(item.expressing_phenotype_wild)
                    .push_bind(item.dominance);
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
    pub async fn delete_filtered_allele_exprs(
        &self,
        filter: &FilterGroup<AlleleExpressionFieldName>,
    ) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("DELETE FROM allele_exprs");
        filter.add_filtered_query(&mut qb, true, false);

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete Allele Expression error: {e}");
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
    use crate::models::allele_expr::{AlleleExpressionDb, AlleleExpressionFieldName};
    use crate::models::chromosome_name::ChromosomeName;
    use crate::models::expr_relation::ExpressionRelationFieldName;
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::models::{
        allele::Allele, allele_expr::AlleleExpression, gene::Gene, phenotype::Phenotype,
    };
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state.get_allele_exprs().await?;
        assert_eq!(exprs, mock::allele_expr::get_allele_exprs());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_allele_exprs(&FilterGroup::<AlleleExpressionFieldName> {
                filters: vec![vec![(
                    AlleleExpressionFieldName::AlleleName,
                    Filter::Equal("cn64".to_owned()),
                )]],
                order_by: vec![(AlleleExpressionFieldName::AlleleName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::allele_expr::get_filtered_allele_exprs());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_allele_expr_wild_unc119(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_allele_exprs(&FilterGroup::<AlleleExpressionFieldName> {
                filters: vec![
                    vec![(
                        AlleleExpressionFieldName::ExpressingPhenotypeWild,
                        Filter::True,
                    )],
                    vec![(
                        AlleleExpressionFieldName::ExpressingPhenotypeName,
                        Filter::Equal("unc-119".to_string()),
                    )],
                ],
                order_by: vec![(AlleleExpressionFieldName::AlleleName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::allele_expr::get_wild_unc119_allele_exprs());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_allele_expr_empty_filter_multi_order_by(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_allele_exprs(&FilterGroup::<AlleleExpressionFieldName> {
                filters: vec![],
                order_by: vec![
                    (AlleleExpressionFieldName::Dominance, Order::Asc),
                    (
                        AlleleExpressionFieldName::ExpressingPhenotypeName,
                        Order::Asc,
                    ),
                    (AlleleExpressionFieldName::AlleleName, Order::Asc),
                ],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::allele_expr::get_allele_exprs_multi_order_by());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_search_allele_expr_by_allele_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_allele_exprs(&FilterGroup::<AlleleExpressionFieldName> {
                filters: vec![vec![(
                    AlleleExpressionFieldName::AlleleName,
                    Filter::Like("2".to_string()),
                )]],
                order_by: vec![
                    (AlleleExpressionFieldName::AlleleName, Order::Asc),
                    (
                        AlleleExpressionFieldName::ExpressingPhenotypeName,
                        Order::Asc,
                    ),
                ],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(
            exprs,
            mock::allele_expr::search_allele_exprs_by_allele_name()
        );
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_search_allele_expr_by_phenotype_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_allele_exprs(&FilterGroup::<AlleleExpressionFieldName> {
                filters: vec![vec![(
                    AlleleExpressionFieldName::ExpressingPhenotypeName,
                    Filter::Like("unc-".to_string()),
                )]],
                order_by: vec![
                    (
                        AlleleExpressionFieldName::ExpressingPhenotypeName,
                        Order::Asc,
                    ),
                    (AlleleExpressionFieldName::AlleleName, Order::Asc),
                ],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(
            exprs,
            mock::allele_expr::search_allele_exprs_by_phenotype_name()
        );
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        state
            .insert_gene(&Gene {
                systematic_name: "T14B4.7".to_string(),
                descriptive_name: Some("dpy-10".to_string()),
                chromosome: Some(ChromosomeName::Ii),
                phys_loc: Some(6710149),
                gen_loc: Some(0.0),
                recomb_suppressor: None,
            })
            .await?;
        state
            .insert_allele(&Allele {
                name: "cn64".to_string(),
                contents: None,
                systematic_gene_name: Some("T14B4.7".to_string()),
                variation_name: None,
            })
            .await?;
        state
            .insert_phenotype(&Phenotype {
                name: "dpy-10".to_string(),
                wild: false,
                short_name: "dpy".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(4.0),
            })
            .await?;

        let expr = AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "dpy-10".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        };

        state.insert_allele_expr(&expr).await?;
        let exprs = state.get_allele_exprs().await?;
        assert_eq!(vec![expr], exprs);

        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_allele_exprs(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        state
            .insert_gene(&Gene {
                systematic_name: "T14B4.7".to_string(),
                descriptive_name: Some("dpy-10".to_string()),
                chromosome: Some(ChromosomeName::Ii),
                phys_loc: Some(6710149),
                gen_loc: Some(0.0),
                recomb_suppressor: None,
            })
            .await?;
        state
            .insert_allele(&Allele {
                name: "cn64".to_string(),
                contents: None,
                systematic_gene_name: Some("T14B4.7".to_string()),
                variation_name: None,
            })
            .await?;
        state
            .insert_phenotype(&Phenotype {
                name: "dpy-10".to_string(),
                wild: false,
                short_name: "dpy".to_string(),
                description: None,
                male_mating: Some(0),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(4.0),
            })
            .await?;

        let csv_str = "alleleName,expressingPhenotypeName,expressingPhenotypeWild,dominance
cn64,\"dpy-10\",0,0"
            .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new().has_headers(true).from_reader(buf);
        let bulk: Bulk<AlleleExpressionDb> = Bulk::from_reader(&mut reader);

        state.insert_allele_exprs(bulk).await?;

        let expected_exprs: Vec<AlleleExpression> = vec![AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "dpy-10".to_string(),
            expressing_phenotype_wild: false,
            dominance: 0,
        }];
        let exprs = state.get_allele_exprs().await?;
        assert_eq!(expected_exprs, exprs);
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_delete_single_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let mut allele_exprs: Vec<AlleleExpression> = state.get_allele_exprs().await?;
        assert_eq!(
            allele_exprs.len(),
            mock::allele_expr::get_allele_exprs().len()
        );

        let delete_filter = &FilterGroup::<AlleleExpressionFieldName> {
            filters: vec![
                vec![(
                    AlleleExpressionFieldName::AlleleName,
                    Filter::Equal("cn64".to_string()),
                )],
                vec![(
                    AlleleExpressionFieldName::ExpressingPhenotypeName,
                    Filter::Equal("dpy-10".to_string()),
                )],
                vec![(
                    AlleleExpressionFieldName::ExpressingPhenotypeWild,
                    Filter::False,
                )],
            ],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        state.delete_filtered_allele_exprs(delete_filter).await?;

        allele_exprs = state.get_allele_exprs().await?;
        assert_eq!(
            allele_exprs.len(),
            mock::allele_expr::get_allele_exprs().len() - 1
        );

        allele_exprs = state.get_filtered_allele_exprs(delete_filter).await?;
        assert_eq!(allele_exprs.len(), 0);

        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_delete_filtered_allele_exprs(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut allele_exprs: Vec<AlleleExpression> = state.get_allele_exprs().await?;
        let orig_len = allele_exprs.len();
        assert_eq!(orig_len, mock::allele_expr::get_allele_exprs().len());

        let filter = &FilterGroup::<AlleleExpressionFieldName> {
            filters: vec![vec![(
                AlleleExpressionFieldName::AlleleName,
                Filter::Equal("cn64".to_string()),
            )]],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        allele_exprs = state.get_filtered_allele_exprs(filter).await?;
        let filtered_len = allele_exprs.len();
        assert!(filtered_len > 0);

        state.delete_filtered_allele_exprs(filter).await?;
        allele_exprs = state.get_allele_exprs().await?;

        assert_eq!(allele_exprs.len(), orig_len - filtered_len);
        assert_eq!(state.get_filtered_allele_exprs(filter).await?.len(), 0);

        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_delete_all_allele_exprs(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        // remove dependencies
        state
            .delete_filtered_expr_relations(&FilterGroup::<ExpressionRelationFieldName> {
                filters: vec![],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        let mut allele_exprs: Vec<AlleleExpression> = state.get_allele_exprs().await?;
        assert_eq!(
            allele_exprs.len(),
            mock::allele_expr::get_allele_exprs().len()
        );

        let filter = &FilterGroup::<AlleleExpressionFieldName> {
            filters: vec![],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        state.delete_filtered_allele_exprs(filter).await?;
        allele_exprs = state.get_allele_exprs().await?;

        assert_eq!(allele_exprs.len(), 0);

        Ok(())
    }
}
