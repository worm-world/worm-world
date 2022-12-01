use super::query_builder::{get_order_by_clause, get_where_clause};
use super::{DbError, InnerDbState};
use crate::models::allele_expr::{AlleleExpression, AlleleExpressionDb};
use crate::models::filter_info::FilterInfo;
use anyhow::Result;
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
        filter: &FilterInfo,
    ) -> Result<Vec<AlleleExpression>, DbError> {
        let query = "SELECT allele_name, expressing_phenotype_name, expressing_phenotype_wild, dominance FROM allele_exprs"
        .to_owned()
            + &get_where_clause(filter)
            + &get_order_by_clause(filter);

        match sqlx::query_as::<_, AlleleExpressionDb>(&query)
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
    use std::collections::HashMap;

    use crate::dummy::testdata;
    use crate::models::filter_info::{FieldName, FilterInfo};
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
        // TODO: implement
        let exprs = state.get_allele_exprs().await?;
        assert_eq!(exprs, testdata::get_allele_exprs());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_allele_expr(pool: Pool<Sqlite>) -> Result<()> {
        println!("entered");
        let state = InnerDbState { conn_pool: pool };
        // TODO: implement
        let exprs = state
            .get_filtered_allele_exprs(&FilterInfo {
                col_filters: HashMap::from([(
                    FieldName::AlleleName,
                    Vec::from(["cn64".to_owned()]),
                )]),
                col_ranges: HashMap::new(),
                order_by: Vec::new(),
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
                name: "dpy-10".to_string(),
                chromosome: Some("II".to_string()),
                phys_loc: Some(6710149),
                gen_loc: Some(0.0),
            })
            .await?;
        state
            .insert_allele(&Allele {
                name: "cn64".to_string(),
                contents: None,
                gene_name: Some("dpy-10".to_string()),
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
