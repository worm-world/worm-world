use super::{DbError, InnerDbState};
use crate::models::{
    allele_expr::{AlleleExpression, AlleleExpressionDb, AlleleExpressionFieldName},
    filter::{Filter, FilterQueryBuilder},
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
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_allele_exprs(
        &self,
        filter: &Filter<AlleleExpressionFieldName>,
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
                Err(DbError::SqlQueryError(e.to_string()))
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
                Err(DbError::SqlInsertError(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {
    use crate::dummy::testdata;
    use crate::models::allele_expr::AlleleExpressionFieldName;
    use crate::models::chromosome::Chromosome;
    use crate::models::filter::{Filter, FilterType};
    use crate::models::{
        allele::Allele, allele_expr::AlleleExpression, gene::Gene, phenotype::Phenotype,
    };
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state.get_allele_exprs().await?;
        assert_eq!(exprs, testdata::get_allele_exprs());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_allele_exprs(&Filter::<AlleleExpressionFieldName> {
                filters: vec![vec![(
                    AlleleExpressionFieldName::AlleleName,
                    FilterType::Equal("cn64".to_owned()),
                )]],
                order_by: vec![AlleleExpressionFieldName::AlleleName],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_allele_exprs());
        Ok(())
    }

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
}
