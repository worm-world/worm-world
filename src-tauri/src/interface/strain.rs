use super::{DbError, InnerDbState};
use crate::models::{
    filter::{Count, FilterGroup, FilterQueryBuilder},
    strain::{Strain, StrainFieldName},
};

use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_strains(&self) -> Result<Vec<Strain>, DbError> {
        match sqlx::query_as!(
            Strain,
            "
            SELECT name, notes FROM strains ORDER BY name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(strains) => Ok(strains),
            Err(e) => {
                eprint!("Get alleles error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_strains(
        &self,
        filter: &FilterGroup<StrainFieldName>,
    ) -> Result<Vec<Strain>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("SELECT name, notes from strains");
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<Strain>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().collect()),
            Err(e) => {
                eprint!("Get Filtered Strains error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_count_filtered_strains(
        &self,
        filter: &FilterGroup<StrainFieldName>,
    ) -> Result<u32, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT COUNT(*) as count FROM strains");
        filter.add_filtered_query(&mut qb, true, false);

        match qb
            .build_query_as::<Count>()
            .fetch_one(&self.conn_pool)
            .await
        {
            Ok(count) => Ok(count.count),
            Err(e) => {
                eprint!("Get Filtered Strain Count error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_strain(&self, strain: &Strain) -> Result<(), DbError> {
        match sqlx::query!(
            "
            INSERT INTO strains (name, notes)
            VALUES ($1, $2)
            ",
            strain.name,
            strain.notes,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Strain error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn delete_filtered_strains(
        &self,
        filter: &FilterGroup<StrainFieldName>,
    ) -> Result<(), DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new("DELETE FROM strains");
        filter.add_filtered_query(&mut qb, true, false);

        match qb.build().execute(&self.conn_pool).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete Strain error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {}
