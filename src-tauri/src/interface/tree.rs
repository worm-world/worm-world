use super::{DbError, InnerDbState};
use crate::models::{
    filter::{Filter, FilterQueryBuilder},
    tree::{Tree, TreeFieldName},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_trees(&self) -> Result<Vec<Tree>, DbError> {
        match sqlx::query_as!(
            Tree,
            "
            SELECT id, name, last_edited, data FROM trees ORDER BY id
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(trees) => Ok(trees.into_iter().collect()),
            Err(e) => {
                eprint!("Get trees error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_trees(
        &self,
        filter: &Filter<TreeFieldName>,
    ) -> Result<Vec<Tree>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT id, name, last_edited, data FROM trees",
        );
        filter.add_filtered_query(&mut qb);

        match qb
            .build_query_as::<Tree>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().collect()),
            Err(e) => {
                eprint!("Get Filtered Tree error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_tree(&self, tree: &Tree) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO trees (id, name, last_edited, data)
            VALUES($1, $2, $3, $4)
            ",
            tree.id,
            tree.name,
            tree.last_edited,
            tree.data,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Tree error: {e}");
                Err(DbError::Insert(e.to_string()))
            }
        }
    }

    pub async fn update_tree(&self, tree: &Tree) -> Result<(), DbError> {
        match sqlx::query!(
            "UPDATE trees
            SET name = $2,
                last_edited = $3,
                data = $4
            WHERE
                id = $1",
            tree.id,
            tree.name,
            tree.last_edited,
            tree.data,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Update Tree error: {e}");
                Err(DbError::Update(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::models::tree::{Tree, TreeFieldName};
    use crate::InnerDbState;
    use crate::{
        dummy::testdata,
        models::filter::{Filter, FilterType},
    };
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_trees tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_trees(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut trees: Vec<Tree> = state.get_trees().await?;
        trees.sort_by(|a, b| (a.id.cmp(&b.id)));

        assert_eq!(trees, testdata::get_trees());
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_trees tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_trees(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_trees(&Filter::<TreeFieldName> {
                filters: vec![vec![
                    (
                        TreeFieldName::Id,
                        FilterType::Equal("1".to_owned()),
                    ),
                ]],
                order_by: vec![],
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_trees());
        Ok(())
    }
    /* #endregion */

    /* #region insert_tree tests */
    #[sqlx::test]
    async fn test_insert_tree(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let trees: Vec<Tree> = state.get_trees().await?;
        assert_eq!(trees.len(), 0);

        let expected =  Tree{
            id: 1,
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
        };

        state.insert_tree(&expected).await?;
        let trees: Vec<Tree> = state.get_trees().await?;

        assert_eq!(vec![expected], trees);
        Ok(())
    }

    /* #endregion */
    /* #region update_tree tests */

    #[sqlx::test]
    async fn test_update_tree(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let trees: Vec<Tree> = state.get_trees().await?;
        assert_eq!(trees.len(), 0);

        let expected =  Tree{
            id: 1,
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
        };

        state.insert_tree(&expected).await?;
        let trees: Vec<Tree> = state.get_trees().await?;

        assert_eq!(vec![expected], trees);

        let new_expected =  Tree{
            id: 1,
            name: "test11341".to_string(),
            last_edited: "2012-05-13".to_string(),
            data: "{foo}".to_string(),
        };
        state.update_tree(&new_expected).await?;
        let trees: Vec<Tree> = state.get_trees().await?;

        assert_eq!(vec![new_expected], trees);
        Ok(())
    }
    /* #endregion */
}
