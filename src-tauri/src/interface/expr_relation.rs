use super::{bulk::Bulk, DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::{
    expr_relation::{ExpressionRelation, ExpressionRelationDb, ExpressionRelationFieldName},
    filter::{Count, FilterGroup, FilterQueryBuilder},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_expr_relations(&self) -> Result<Vec<ExpressionRelation>, DbError> {
        match sqlx::query_as!(
            ExpressionRelationDb,
            "
            SELECT
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition,
                is_suppressing
            FROM
                expr_relations
            ORDER BY
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Expr Relations error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_expr_relations(
        &self,
        filter: &FilterGroup<ExpressionRelationFieldName>,
    ) -> Result<Vec<ExpressionRelation>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition,
                is_suppressing
            FROM
                expr_relations",
        );
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<ExpressionRelationDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Exprs Relation error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_count_filtered_expr_relations(
        &self,
        filter: &FilterGroup<ExpressionRelationFieldName>,
    ) -> Result<u32, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT COUNT(*) as count FROM expr_relations");
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

    pub async fn insert_expr_relation(&self, relation: &ExpressionRelation) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO expr_relations (
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition,
                is_suppressing
            )
            VALUES(?, ?, ?, ?, ?, ?, ?)
            ",
            relation.allele_name,
            relation.expressing_phenotype_name,
            relation.expressing_phenotype_wild,
            relation.altering_phenotype_name,
            relation.altering_phenotype_wild,
            relation.altering_condition,
            relation.is_suppressing,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert ExprRelation error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn insert_expr_relations(
        &self,
        bulk: Bulk<ExpressionRelationDb>,
    ) -> Result<(), DbError> {
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
                "INSERT OR IGNORE INTO expr_relations (
                allele_name,
                expressing_phenotype_name,
                expressing_phenotype_wild,
                altering_phenotype_name,
                altering_phenotype_wild,
                altering_condition,
                is_suppressing
            ) ",
            );
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
                    .push_bind(item.altering_phenotype_name)
                    .push_bind(item.altering_phenotype_wild)
                    .push_bind(item.altering_condition)
                    .push_bind(item.is_suppressing);
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

    pub async fn delete_filtered_expr_relations(
        &self,
        filter: &FilterGroup<ExpressionRelationFieldName>,
    ) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("DELETE FROM expr_relations");
        filter.add_filtered_query(&mut qb, true, false);

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete Expression Relation error: {e}");
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
    use crate::models::expr_relation::{ExpressionRelationDb, ExpressionRelationFieldName};
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::models::{
        allele::Allele, allele_expr::AlleleExpression, expr_relation::ExpressionRelation,
        phenotype::Phenotype, variation::Variation,
    };
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let rels = state.get_expr_relations().await?;
        assert_eq!(rels, mock::expr_relation::get_expr_relations());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_expr_relations(&FilterGroup::<ExpressionRelationFieldName> {
                filters: vec![
                    vec![(
                        ExpressionRelationFieldName::AlteringCondition,
                        Filter::Equal("Histamine".to_owned()),
                    )],
                    vec![(
                        ExpressionRelationFieldName::ExpressingPhenotypeName,
                        Filter::Equal("paralyzed".to_owned()),
                    )],
                ],
                order_by: vec![(ExpressionRelationFieldName::AlleleName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::expr_relation::get_filtered_expr_relations());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_expr_relations_many_and_clauses(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let filter = FilterGroup::<ExpressionRelationFieldName> {
            filters: vec![
                vec![(
                    ExpressionRelationFieldName::ExpressingPhenotypeName,
                    Filter::Equal("paralyzed".to_owned()),
                )],
                vec![(
                    ExpressionRelationFieldName::AlteringCondition,
                    Filter::NotNull,
                )],
                vec![(
                    ExpressionRelationFieldName::ExpressingPhenotypeWild,
                    Filter::False,
                )],
                vec![(
                    ExpressionRelationFieldName::AlteringPhenotypeName,
                    Filter::Null,
                )],
                vec![(ExpressionRelationFieldName::IsSuppressing, Filter::False)],
                vec![(
                    ExpressionRelationFieldName::AlleleName,
                    Filter::Equal("oxEx219999".to_string()),
                )],
            ],
            order_by: vec![(ExpressionRelationFieldName::AlleleName, Order::Asc)],
            limit: None,
            offset: None,
        };
        let exprs = state.get_filtered_expr_relations(&filter).await?;

        let expected = mock::expr_relation::get_filtered_expr_relations_many_and_clauses();

        assert_eq!(exprs, expected);
        let count = state.get_count_filtered_expr_relations(&filter).await?;
        assert_eq!(count as usize, expected.len(),);
        Ok(())
    }
    #[sqlx::test(fixtures("full_db"))]
    async fn test_search_expr_relations_by_allele_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_expr_relations(&FilterGroup::<ExpressionRelationFieldName> {
                filters: vec![vec![(
                    ExpressionRelationFieldName::AlleleName,
                    Filter::Like("6".to_owned()),
                )]],
                order_by: vec![(ExpressionRelationFieldName::AlleleName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(
            exprs,
            mock::expr_relation::search_expr_relations_by_allele_name()
        );
        Ok(())
    }
    #[sqlx::test(fixtures("full_db"))]
    async fn test_search_expr_relations_by_allele_name_and_expressing_phenotype(
        pool: Pool<Sqlite>,
    ) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_expr_relations(&FilterGroup::<ExpressionRelationFieldName> {
                filters: vec![
                    vec![(
                        ExpressionRelationFieldName::AlleleName,
                        Filter::Like("ox".to_owned()),
                    )],
                    vec![(
                        ExpressionRelationFieldName::ExpressingPhenotypeName,
                        Filter::Like("yfp".to_owned()),
                    )],
                ],
                order_by: vec![(ExpressionRelationFieldName::AlleleName, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(
            exprs,
            mock::expr_relation::search_expr_relations_by_allele_name_and_expressing_phenotype()
        );
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        // oxIs644 Variation
        state
            .insert_variation(&Variation {
                allele_name: "oxIs644".to_string(), // not a foreign key
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            })
            .await?;
        // oxIs644 Allele
        state
            .insert_allele(&Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            })
            .await?;

        // YFP(pharynx) not wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "YFP(pharynx)".to_string(),
                wild: false,
                short_name: "YFP(pharynx)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await?;
        // Flp wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "Flp".to_string(),
                wild: true,
                short_name: "Flp(+)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await?;

        // oxIs644 -> YFP(pharynx) expr
        state
            .insert_allele_expr(&AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: 2,
            })
            .await?;

        let rel = ExpressionRelation {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("Flp".to_string()),
            altering_phenotype_wild: Some(true),
            altering_condition: None,
            is_suppressing: false,
        };

        let csv_str = "allele_name,expressing_phenotype_name,expressing_phenotype_wild,altering_phenotype_name,altering_phenotype_wild,altering_condition,is_suppressing
oxIs644,YFP(pharynx),0,Flp,1,,0"
            .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new().has_headers(true).from_reader(buf);
        let bulk: Bulk<ExpressionRelationDb> = Bulk::from_reader(&mut reader);

        state.insert_expr_relations(bulk).await?;

        let rels = state.get_expr_relations().await?;
        assert_eq!(vec![rel], rels);
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_expr_relation(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        // oxIs644 Variation
        state
            .insert_variation(&Variation {
                allele_name: "oxIs644".to_string(), // not a foreign key
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            })
            .await?;
        // oxIs644 Allele
        state
            .insert_allele(&Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            })
            .await?;

        // YFP(pharynx) not wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "YFP(pharynx)".to_string(),
                wild: false,
                short_name: "YFP(pharynx)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await?;
        // Flp wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "Flp".to_string(),
                wild: true,
                short_name: "Flp(+)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await?;

        // oxIs644 -> YFP(pharynx) expr
        state
            .insert_allele_expr(&AlleleExpression {
                allele_name: "oxIs644".to_string(),
                expressing_phenotype_name: "YFP(pharynx)".to_string(),
                expressing_phenotype_wild: false,
                dominance: 2,
            })
            .await?;

        let rel = ExpressionRelation {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("Flp".to_string()),
            altering_phenotype_wild: Some(true),
            altering_condition: None,
            is_suppressing: false,
        };

        state.insert_expr_relation(&rel).await?;
        let rels = state.get_expr_relations().await?;
        assert_eq!(vec![rel], rels);
        Ok(())
    }
    #[sqlx::test]
    #[should_panic]
    async fn test_insert_expr_relation_missing_expr(pool: Pool<Sqlite>) {
        let state = InnerDbState { conn_pool: pool };
        // oxIs644 Variation
        state
            .insert_variation(&Variation {
                allele_name: "oxIs644".to_string(), // not a foreign key
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
                recomb_suppressor: None,
            })
            .await
            .unwrap();
        // oxIs644 Allele
        state
            .insert_allele(&Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                systematic_gene_name: None,
                variation_name: Some("oxIs644".to_string()),
            })
            .await
            .unwrap();

        // YFP(pharynx) not wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "YFP(pharynx)".to_string(),
                wild: false,
                short_name: "YFP(pharynx)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await
            .unwrap();
        // Flp wild - Phenotype
        state
            .insert_phenotype(&Phenotype {
                name: "Flp".to_string(),
                wild: true,
                short_name: "Flp(+)".to_string(),
                description: None,
                male_mating: Some(3),
                lethal: Some(false),
                female_sterile: Some(false),
                arrested: Some(false),
                maturation_days: Some(3.0),
            })
            .await
            .unwrap();

        // oxIs644 -> YFP(pharynx) expr - MISSING

        let rel = ExpressionRelation {
            allele_name: "oxIs644".to_string(),
            expressing_phenotype_name: "YFP(pharynx)".to_string(),
            expressing_phenotype_wild: false,
            altering_phenotype_name: Some("Flp".to_string()),
            altering_phenotype_wild: Some(true),
            altering_condition: None,
            is_suppressing: false,
        };

        state.insert_expr_relation(&rel).await.unwrap();
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_delete_single_condition(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let mut expr_relations: Vec<ExpressionRelation> = state.get_expr_relations().await?;
        assert_eq!(
            expr_relations.len(),
            mock::expr_relation::get_expr_relations().len()
        );

        let delete_filter = &FilterGroup::<ExpressionRelationFieldName> {
            filters: vec![
                vec![(
                    ExpressionRelationFieldName::AlleleName,
                    Filter::Equal("eT1(III)".to_string()),
                )],
                vec![(
                    ExpressionRelationFieldName::ExpressingPhenotypeName,
                    Filter::Equal("eT1IIIhet_aneuploid".to_string()),
                )],
                vec![(
                    ExpressionRelationFieldName::ExpressingPhenotypeWild,
                    Filter::False,
                )],
                vec![(
                    ExpressionRelationFieldName::AlteringPhenotypeName,
                    Filter::Equal("eT1Vhet_aneuploid".to_string()),
                )],
                vec![(
                    ExpressionRelationFieldName::AlteringPhenotypeWild,
                    Filter::False,
                )],
                vec![(ExpressionRelationFieldName::AlteringCondition, Filter::Null)],
            ],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        state.delete_filtered_expr_relations(delete_filter).await?;

        expr_relations = state.get_expr_relations().await?;
        assert_eq!(
            expr_relations.len(),
            mock::expr_relation::get_expr_relations().len() - 1
        );

        expr_relations = state.get_filtered_expr_relations(delete_filter).await?;
        assert_eq!(expr_relations.len(), 0);

        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_delete_filtered_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut expr_relations: Vec<ExpressionRelation> = state.get_expr_relations().await?;
        let orig_len = expr_relations.len();
        assert_eq!(orig_len, mock::expr_relation::get_expr_relations().len());

        let filter = &FilterGroup::<ExpressionRelationFieldName> {
            filters: vec![vec![(
                ExpressionRelationFieldName::AlteringCondition,
                Filter::Null,
            )]],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        expr_relations = state.get_filtered_expr_relations(filter).await?;
        let filtered_len = expr_relations.len();
        assert!(filtered_len > 0);

        state.delete_filtered_expr_relations(filter).await?;
        expr_relations = state.get_expr_relations().await?;

        assert_eq!(expr_relations.len(), orig_len - filtered_len);
        assert_eq!(state.get_filtered_expr_relations(filter).await?.len(), 0);

        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_delete_all_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut expr_relations: Vec<ExpressionRelation> = state.get_expr_relations().await?;
        assert_eq!(
            expr_relations.len(),
            mock::expr_relation::get_expr_relations().len()
        );

        let filter = &FilterGroup::<ExpressionRelationFieldName> {
            filters: vec![],
            order_by: vec![],
            limit: None,
            offset: None,
        };

        state.delete_filtered_expr_relations(filter).await?;
        expr_relations = state.get_expr_relations().await?;

        assert_eq!(expr_relations.len(), 0);

        Ok(())
    }
}
