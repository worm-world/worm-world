use super::{DbError, InnerDbState};
use crate::models::{
    cross_design::{CrossDesign, CrossDesignDb, CrossDesignFieldName},
    filter::{FilterGroup, FilterQueryBuilder},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_cross_designs(&self) -> Result<Vec<CrossDesign>, DbError> {
        match sqlx::query_as!(
            CrossDesignDb,
            "
            SELECT id, name, last_edited, data, editable FROM cross_designs ORDER BY id
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(cross_designs) => Ok(cross_designs.into_iter().map(|t| t.into()).collect()),
            Err(e) => {
                eprint!("Get cross_designs error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_cross_designs(
        &self,
        filter: &FilterGroup<CrossDesignFieldName>,
    ) -> Result<Vec<CrossDesign>, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT id, name, last_edited, data, editable FROM cross_designs");
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<CrossDesignDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(cross_designs) => Ok(cross_designs.into_iter().map(|t| t.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Cross Design error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_cross_design(&self, cross_design: &CrossDesign) -> Result<(), DbError> {
        let editable = cross_design.editable as i32;
        match sqlx::query!(
            "INSERT INTO cross_designs (id, name, last_edited, data, editable)
            VALUES(?, ?, ?, ?, ?)
            ",
            cross_design.id,
            cross_design.name,
            cross_design.last_edited,
            cross_design.data,
            editable,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert CrossDesign error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn update_cross_design(&self, cross_design: &CrossDesign) -> Result<(), DbError> {
        let editable = cross_design.editable as i32;
        match sqlx::query!(
            "UPDATE cross_designs
            SET name = ?,
                last_edited = ?,
                data = ?,
                editable = ?
            WHERE
                id = ?",
            cross_design.name,
            cross_design.last_edited,
            cross_design.data,
            editable,
            cross_design.id,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Update cross design error: {e}");
                Err(DbError::Update(e.to_string()))
            }
        }
    }

    pub async fn delete_cross_design(&self, id: String) -> Result<(), DbError> {
        match sqlx::query!(
            "DELETE FROM cross_designs
            WHERE id = ?",
            id
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete CrossDesign error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::models::cross_design::{CrossDesign, CrossDesignFieldName};
    use crate::InnerDbState;
    use crate::{
        interface::mock,
        models::filter::{Filter, FilterGroup},
    };
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_cross_designs(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;
        cross_designs.sort_by(|a, b| (a.id.cmp(&b.id)));

        assert_eq!(cross_designs, mock::cross_design::get_cross_designs());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_cross_designs(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_cross_designs(&FilterGroup::<CrossDesignFieldName> {
                filters: vec![vec![(
                    CrossDesignFieldName::Id,
                    Filter::Equal("1".to_owned()),
                )]],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::cross_design::get_filtered_cross_designs());
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_cross_design(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;
        assert_eq!(cross_designs.len(), 0);

        let expected = CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };

        state.insert_cross_design(&expected).await?;
        let cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;

        assert_eq!(vec![expected], cross_designs);
        Ok(())
    }

    #[sqlx::test]
    async fn test_update_cross_design(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;
        assert_eq!(cross_designs.len(), 0);

        let expected = CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };

        state.insert_cross_design(&expected).await?;
        let cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;

        assert_eq!(vec![expected], cross_designs);

        let new_expected = CrossDesign {
            id: "1".to_string(),
            name: "test11341".to_string(),
            last_edited: "2012-05-13".to_string(),
            data: "{foo}".to_string(),
            editable: false,
        };
        state.update_cross_design(&new_expected).await?;
        let cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;

        assert_eq!(vec![new_expected], cross_designs);
        Ok(())
    }

    #[sqlx::test]
    pub async fn test_delete_cross_design(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;
        assert_eq!(cross_designs.len(), 0);

        let expected = CrossDesign {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };

        state.insert_cross_design(&expected).await?;
        let cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;

        assert_eq!(vec![expected], cross_designs);

        state.delete_cross_design("1".to_string()).await?;
        let cross_designs: Vec<CrossDesign> = state.get_cross_designs().await?;
        assert_eq!(cross_designs.len(), 0);

        Ok(())
    }
}
