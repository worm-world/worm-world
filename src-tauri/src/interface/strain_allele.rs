use super::{DbError, InnerDbState};
use crate::models::{
    filter::{Count, FilterGroup, FilterQueryBuilder},
    strain_allele::{StrainAllele, StrainAlleleFieldName},
};

use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_strain_alleles(&self) -> Result<Vec<StrainAllele>, DbError> {
        match sqlx::query_as!(
            StrainAllele,
            "
            SELECT strain, allele FROM strain_alleles ORDER BY strain
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(strain_alleles) => Ok(strain_alleles),
            Err(e) => {
                eprint!("Get strain alleles error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_strain_alleles(
        &self,
        filter: &FilterGroup<StrainAlleleFieldName>,
    ) -> Result<Vec<StrainAllele>, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT strain, allele from strain_alleles");
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<StrainAllele>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().collect()),
            Err(e) => {
                eprint!("Get filtered strail alleles error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_count_filtered_strain_alleles(
        &self,
        filter: &FilterGroup<StrainAlleleFieldName>,
    ) -> Result<u32, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT COUNT(*) as count FROM strain_alleles");
        filter.add_filtered_query(&mut qb, true, false);

        match qb
            .build_query_as::<Count>()
            .fetch_one(&self.conn_pool)
            .await
        {
            Ok(count) => Ok(count.count),
            Err(e) => {
                eprint!("Get filtered strain alleles count error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_strain_allele(&self, strain_allele: &StrainAllele) -> Result<(), DbError> {
        match sqlx::query!(
            "
            INSERT INTO strain_alleles (strain, allele)
            VALUES ($1, $2)
            ",
            strain_allele.strain,
            strain_allele.allele,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert strain allele error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn delete_filtered_strain_alleles(
        &self,
        filter: &FilterGroup<StrainAlleleFieldName>,
    ) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("DELETE FROM strain_alleles");
        filter.add_filtered_query(&mut qb, true, false);

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete strain allele error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {}
