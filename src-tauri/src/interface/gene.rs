use super::{
    query_builder::qb_gene::{get_order_by_clause, get_where_clause},
    DbError, InnerDbState,
};
use crate::models::{filters::gene_filter::GeneFilter, gene::Gene};
use anyhow::Result;

impl InnerDbState {
    pub async fn get_genes(&self) -> Result<Vec<Gene>, DbError> {
        match sqlx::query_as!(
            Gene,
            "
            SELECT name, chromosome, phys_loc, gen_loc FROM genes ORDER BY name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(genes) => Ok(genes),
            Err(e) => {
                eprint!("Get genes error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_genes(&self, filter: &GeneFilter) -> Result<Vec<Gene>, DbError> {
        let query = "SELECT name, chromosome, phys_loc, gen_loc FROM genes".to_owned()
            + &get_where_clause(filter)
            + &get_order_by_clause(filter);

        match sqlx::query_as::<_, Gene>(&query)
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().collect()),
            Err(e) => {
                eprint!("Get Filtered Gene error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn insert_gene(&self, gene: &Gene) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO genes (name, chromosome, phys_loc, gen_loc)
            VALUES($1, $2, $3, $4)
            ",
            gene.name,
            gene.chromosome,
            gene.phys_loc,
            gene.gen_loc
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
    use std::collections::HashMap;

    use crate::models::gene::{Gene, GeneFieldName};
    use crate::InnerDbState;
    use crate::{dummy::testdata, models::filters::gene_filter::GeneFilter};
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut genes: Vec<Gene> = state.get_genes().await?;
        genes.sort_by(|a, b| (a.name.cmp(&b.name)));

        assert_eq!(genes, testdata::get_genes());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_genes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_genes(&GeneFilter {
                col_filters: HashMap::from([(
                    GeneFieldName::Chromosome,
                    vec!["X".to_owned(), "IV".to_owned()],
                )]),
                col_special_filters: HashMap::new(),
                order_by: vec![GeneFieldName::Name],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_genes());
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_gene(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let genes: Vec<Gene> = state.get_genes().await?;
        assert_eq!(genes.len(), 0);

        let expected = Gene {
            name: "unc-119".to_string(),
            chromosome: Some("III".to_string()),
            phys_loc: Some(10902641),
            gen_loc: Some(5.59),
        };

        state.insert_gene(&expected).await?;
        let genes: Vec<Gene> = state.get_genes().await?;

        assert_eq!(vec![expected], genes);
        Ok(())
    }
}
