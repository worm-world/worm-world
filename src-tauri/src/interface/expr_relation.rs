use super::{DbError, InnerDbState};
use crate::models::{
    expr_relation::{ExpressionRelation, ExpressionRelationDb, ExpressionRelationFieldName},
    filter::{Filter, FilterQueryBuilder},
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
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_expr_relations(
        &self,
        filter: &Filter<ExpressionRelationFieldName>,
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
        filter.add_filtered_query(&mut qb);

        match qb.build_query_as::<ExpressionRelationDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Exprs Relation error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
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
            VALUES($1, $2, $3, $4, $5, $6, $7)
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
                Err(DbError::SqlInsertError(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {
    use std::collections::HashMap;

    use crate::dummy::testdata;
    use crate::models::expr_relation::ExpressionRelationFieldName;
    use crate::models::filter::{Filter, FilterType};
    use crate::models::{
        allele::Allele, allele_expr::AlleleExpression, expr_relation::ExpressionRelation,
        phenotype::Phenotype, variation_info::VariationInfo,
    };
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let rels = state.get_expr_relations().await?;
        assert_eq!(rels, testdata::get_expr_relations());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_expr_relations(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_expr_relations(&Filter::<ExpressionRelationFieldName> {
                col_filters: HashMap::from([
                    (
                        ExpressionRelationFieldName::AlteringCondition,
                        vec![FilterType::Equal("Histamine".to_owned())],
                    ),
                    (
                        ExpressionRelationFieldName::ExpressingPhenotypeName,
                        vec![FilterType::Equal("paralyzed".to_owned())],
                    ),
                ]),
                order_by: vec![ExpressionRelationFieldName::AlleleName],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_expr_relations());
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_expr_relation(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        // oxIs644 Variation
        state
            .insert_variation_info(&VariationInfo {
                allele_name: "oxIs644".to_string(), // not a foreign key
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
            })
            .await?;
        // oxIs644 Allele
        state
            .insert_allele(&Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                gene_name: None,
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
                dominance: Some(2),
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
            .insert_variation_info(&VariationInfo {
                allele_name: "oxIs644".to_string(), // not a foreign key
                chromosome: None,
                phys_loc: None,
                gen_loc: None,
            })
            .await
            .unwrap();
        // oxIs644 Allele
        state
            .insert_allele(&Allele {
                name: "oxIs644".to_string(),
                contents: Some("[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]".to_string()),
                gene_name: None,
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
}
