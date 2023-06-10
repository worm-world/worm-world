use super::{DbError, InnerDbState};
use crate::models::{
    filter::{FilterGroup, FilterQueryBuilder},
    tree::{Tree, TreeDb, TreeFieldName},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_trees(&self) -> Result<Vec<Tree>, DbError> {
        match sqlx::query_as!(
            TreeDb,
            "
            SELECT id, name, last_edited, data, editable FROM trees ORDER BY id
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(trees) => Ok(trees.into_iter().map(|t| t.into()).collect()),
            Err(e) => {
                eprint!("Get trees error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_trees(
        &self,
        filter: &FilterGroup<TreeFieldName>,
    ) -> Result<Vec<Tree>, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT id, name, last_edited, data, editable FROM trees");
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<TreeDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(trees) => Ok(trees.into_iter().map(|t| t.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Tree error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_tree(&self, tree: &Tree) -> Result<(), DbError> {
        let editable = tree.editable as i32;
        match sqlx::query!(
            "INSERT INTO trees (id, name, last_edited, data, editable)
            VALUES(?, ?, ?, ?, ?)
            ",
            tree.id,
            tree.name,
            tree.last_edited,
            tree.data,
            editable,
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
        let editable = tree.editable as i32;
        match sqlx::query!(
            "UPDATE trees
            SET name = ?,
                last_edited = ?,
                data = ?,
                editable = ?
            WHERE
                id = ?",
            tree.name,
            tree.last_edited,
            tree.data,
            editable,
            tree.id,
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

    pub async fn delete_tree(&self, id: String) -> Result<(), DbError> {
        match sqlx::query!(
            "DELETE FROM trees
            WHERE id = ?",
            id
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Delete Tree error: {e}");
                Err(DbError::Delete(e.to_string()))
            }
        }
    }
}

#[cfg(test)]
mod test {

    use crate::models::tree::{Tree, TreeFieldName};
    use crate::InnerDbState;
    use crate::{
        interface::mock,
        models::filter::{Filter, FilterGroup},
    };
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_trees(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let mut trees: Vec<Tree> = state.get_trees().await?;
        trees.sort_by(|a, b| (a.id.cmp(&b.id)));

        assert_eq!(trees, mock::tree::get_trees());
        Ok(())
    }

    #[sqlx::test(fixtures("full_db"))]
    async fn test_get_filtered_trees(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_trees(&FilterGroup::<TreeFieldName> {
                filters: vec![vec![(TreeFieldName::Id, Filter::Equal("1".to_owned()))]],
                order_by: vec![],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, mock::tree::get_filtered_trees());
        Ok(())
    }

    #[sqlx::test]
    async fn test_insert_tree(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let trees: Vec<Tree> = state.get_trees().await?;
        assert_eq!(trees.len(), 0);

        let expected = Tree {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };

        state.insert_tree(&expected).await?;
        let trees: Vec<Tree> = state.get_trees().await?;

        assert_eq!(vec![expected], trees);
        Ok(())
    }

    #[sqlx::test]
    async fn test_update_tree(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let trees: Vec<Tree> = state.get_trees().await?;
        assert_eq!(trees.len(), 0);

        let expected = Tree {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };

        state.insert_tree(&expected).await?;
        let trees: Vec<Tree> = state.get_trees().await?;

        assert_eq!(vec![expected], trees);

        let new_expected = Tree {
            id: "1".to_string(),
            name: "test11341".to_string(),
            last_edited: "2012-05-13".to_string(),
            data: "{foo}".to_string(),
            editable: false,
        };
        state.update_tree(&new_expected).await?;
        let trees: Vec<Tree> = state.get_trees().await?;

        assert_eq!(vec![new_expected], trees);
        Ok(())
    }

    #[sqlx::test]
    pub async fn test_delete_tree(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };

        let trees: Vec<Tree> = state.get_trees().await?;
        assert_eq!(trees.len(), 0);

        let expected = Tree {
            id: "1".to_string(),
            name: "test1".to_string(),
            last_edited: "2012-01-01".to_string(),
            data: "{}".to_string(),
            editable: true,
        };

        state.insert_tree(&expected).await?;
        let trees: Vec<Tree> = state.get_trees().await?;

        assert_eq!(vec![expected], trees);

        state.delete_tree("1".to_string()).await?;
        let trees: Vec<Tree> = state.get_trees().await?;
        assert_eq!(trees.len(), 0);

        Ok(())
    }
}
