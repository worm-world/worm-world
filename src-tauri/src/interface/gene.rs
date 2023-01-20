use super::{DbError, InnerDbState};
use crate::models::{
    filter::{Filter, FilterQueryBuilder},
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
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_genes(
        &self,
        filter: &Filter<GeneFieldName>,
    ) -> Result<Vec<Gene>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT systematic_name, descriptive_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end FROM genes",
        );
        filter.add_filtered_query(&mut qb);

        match qb
            .build_query_as::<GeneDb>()
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

    pub async fn insert_gene(&self, gene: &Gene) -> Result<(), DbError> {
        let (start, end): (Option<i64>, Option<i64>) = match gene.recomb_suppressor {
            Some(recomb_range) => (Some(recomb_range.0), Some(recomb_range.1)),
            None => (None, None),
        };

        let chromosome = gene.chromosome.as_ref().map(|v| v.to_string());
        match sqlx::query!(
            "INSERT INTO genes (systematic_name, descriptive_name, chromosome, phys_loc, gen_loc, recomb_suppressor_start, recomb_suppressor_end)
            VALUES($1, $2, $3, $4, $5, $6, $7)
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
                Err(DbError::SqlInsertError(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::models::chromosome::Chromosome;
    use crate::models::gene::{Gene, GeneFieldName};
    use crate::InnerDbState;
    use crate::{
        dummy::testdata,
        models::filter::{Filter, FilterType},
    };
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_genes tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut genes: Vec<Gene> = state.get_genes().await?;
        genes.sort_by(|a, b| (a.descriptive_name.cmp(&b.descriptive_name)));

        assert_eq!(genes, testdata::get_genes());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_genes tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&Filter::<GeneFieldName> {
                filters: vec![
                    vec![(
                        GeneFieldName::Chromosome,
                        FilterType::Equal("X".to_string()),
                    )],
                    vec![(
                        GeneFieldName::Chromosome,
                        FilterType::Equal("IV".to_string()),
                    )],
                ],
                order_by: vec![GeneFieldName::DescName],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_genes());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_genes_alternate_ordering(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&Filter::<GeneFieldName> {
                filters: vec![
                    vec![(
                        GeneFieldName::Chromosome,
                        FilterType::Equal("X".to_string()),
                    )],
                    vec![(
                        GeneFieldName::Chromosome,
                        FilterType::Equal("IV".to_string()),
                    )],
                ],
                order_by: vec![GeneFieldName::SysName],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_genes_alternate_ordering());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_genes_and_clause(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&Filter::<GeneFieldName> {
                filters: vec![vec![
                    (
                        GeneFieldName::Chromosome,
                        FilterType::Equal("X".to_string()),
                    ),
                    (
                        GeneFieldName::PhysLoc,
                        FilterType::Equal("7682896".to_string()),
                    ),
                ]],
                order_by: vec![],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_genes_and_clause());
        Ok(())
    }
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_genes_and_with_or_clause(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&Filter::<GeneFieldName> {
                filters: vec![
                    vec![
                        (
                            GeneFieldName::Chromosome,
                            FilterType::Equal("X".to_string()),
                        ),
                        (
                            GeneFieldName::PhysLoc,
                            FilterType::Equal("7682896".to_string()),
                        ),
                    ],
                    vec![(
                        GeneFieldName::GeneticLoc,
                        FilterType::GreaterThan("5".to_string(), true),
                    )],
                ],
                order_by: vec![GeneFieldName::DescName],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_genes_and_or_clause());
        Ok(())
    }
    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_genes_by_desc_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&Filter::<GeneFieldName> {
                filters: vec![vec![(
                    GeneFieldName::DescName,
                    FilterType::Like("in".to_string()),
                )]],
                order_by: vec![GeneFieldName::DescName],
            })
            .await?;

        assert_eq!(exprs, testdata::search_genes_by_desc_name());
        Ok(())
    }
    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_genes_by_sys_or_desc_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&Filter::<GeneFieldName> {
                filters: vec![
                    vec![(GeneFieldName::SysName, FilterType::Like("T14".to_string()))],
                    vec![(GeneFieldName::DescName, FilterType::Like("lin".to_string()))],
                ],
                order_by: vec![GeneFieldName::DescName],
            })
            .await?;

        assert_eq!(exprs, testdata::search_genes_by_sys_or_desc_name());
        Ok(())
    }
    /* #endregion */

    /* #region insert_gene tests */
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
    /* #endregion */
}
