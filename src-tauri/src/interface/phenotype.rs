use crate::models::{
    phenotype::{Phenotype, PhenotypeDb},
};
use super::{InnerDbState, DbError};
use anyhow::Result;

impl InnerDbState {
    pub async fn get_phenotypes(&self) -> Result<Vec<Phenotype>, DbError> {
        match sqlx::query_as!(
            PhenotypeDb,
            "
            SELECT name, wild, short_name, description, male_mating, lethal, female_sterile, arrested, maturation_days FROM phenotypes ORDER BY name, wild
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(db_phens) => {
                Ok(db_phens.into_iter().map(|dp| Phenotype::from(dp)).collect::<Vec<Phenotype>>())
            },
            Err(e) => {
                eprint!("Get genes error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }
    pub async fn insert_phenotype(&self, phenotype: Phenotype) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO phenotypes (name, wild, short_name, description, male_mating, lethal, female_sterile, arrested, maturation_days)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ",
            phenotype.name,
            phenotype.wild,
            phenotype.short_name,
            phenotype.description,
            phenotype.male_mating,
            phenotype.lethal,
            phenotype.female_sterile,
            phenotype.arrested,
            phenotype.maturation_days,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Phenotype error: {e}");
                Err(DbError::SqlQueryError(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {
    use crate::dummy::testdata;
    use crate::models::phenotype::Phenotype;
    use crate::InnerDbState;
    use anyhow::Result;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_phenotypes(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState{conn_pool: pool};
        let phens = state.get_phenotypes().await?;
        // TODO: implement
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_insert_phenotype(pool: Pool<Sqlite>) -> Result<()> {
        // TODO: implement
        Ok(())
    }
}
