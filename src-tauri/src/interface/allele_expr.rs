use super::{bulk::Bulk, DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::{
    allele_expr::{AlleleExpression, AlleleExpressionDb, AlleleExpressionFieldName},
    filter::{FilterGroup, FilterQueryBuilder},
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
        filter.add_filtered_query(&mut qb);

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

    pub async fn insert_allele_expr(&self, expr: &AlleleExpression) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO allele_exprs (allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance)
            VALUES($1, $2, $3, $4)
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
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "INSERT INTO allele_exprs (allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance) "
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
            b.push_bind(item.allele_name)
                .push_bind(item.expressing_phenotype_name)
                .push_bind(item.expressing_phenotype_wild)
                .push_bind(item.dominance);
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
    use crate::models::allele_expr::{AlleleExpressionDb, AlleleExpressionFieldName};
    use crate::models::chromosome::Chromosome;
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::models::{
        allele::Allele, allele_expr::AlleleExpression, gene::Gene, phenotype::Phenotype,
    };
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_allele_expr tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state.get_allele_exprs().await?;
        assert_eq!(exprs, testdata::get_allele_exprs());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_allele_expr tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_allele_exprs(&FilterGroup::<AlleleExpressionFieldName> {
                filters: vec![vec![(
                    AlleleExpressionFieldName::AlleleName,
                    Filter::Equal("cn64".to_owned()),
                )]],
                order_by: vec![(AlleleExpressionFieldName::AlleleName, Order::Asc)],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_allele_exprs());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
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
            })
            .await?;

        assert_eq!(exprs, testdata::get_wild_unc119_allele_exprs());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
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
            })
            .await?;

        assert_eq!(exprs, testdata::get_allele_exprs_multi_order_by());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
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
            })
            .await?;

        assert_eq!(exprs, testdata::search_allele_exprs_by_allele_name());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
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
            })
            .await?;

        assert_eq!(exprs, testdata::search_allele_exprs_by_phenotype_name());
        Ok(())
    }
    /* #endregion */

    /* #region insert_allele_expr tests */
    #[sqlx::test]
    async fn test_insert_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        state
            .insert_gene(&Gene {
                systematic_name: "T14B4.7".to_string(),
                descriptive_name: Some("dpy-10".to_string()),
                chromosome: Some(Chromosome::Ii),
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
            dominance: Some(0),
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
                chromosome: Some(Chromosome::Ii),
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
        let mut reader = csv::ReaderBuilder::new()
            .has_headers(true)
            .from_reader(buf);
        let bulk: Bulk<AlleleExpressionDb> = Bulk::from_reader(&mut reader);
        
        state.insert_allele_exprs(bulk).await?;

        let expected_exprs: Vec<AlleleExpression> = vec![AlleleExpression {
            allele_name: "cn64".to_string(),
            expressing_phenotype_name: "dpy-10".to_string(),
            expressing_phenotype_wild: false,
            dominance: Some(0),
        }];
        let exprs = state.get_allele_exprs().await?;
        assert_eq!(expected_exprs, exprs);
        Ok(())
    }
    /* #endregion */
}
