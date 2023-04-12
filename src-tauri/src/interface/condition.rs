use super::{bulk::Bulk, DbError, InnerDbState, SQLITE_BIND_LIMIT};
use crate::models::{
    condition::{Condition, ConditionDb, ConditionFieldName},
    expr_relation::ExpressionRelationFieldName,
    filter::{Count, FilterGroup, FilterQueryBuilder},
};
use anyhow::Result;
use sqlx::{QueryBuilder, Sqlite};

impl InnerDbState {
    pub async fn get_conditions(&self) -> Result<Vec<Condition>, DbError> {
        match sqlx::query_as!(
            ConditionDb,
            "
            SELECT
                name,
                description,
                male_mating,
                lethal,
                female_sterile,
                arrested,
                maturation_days
            FROM conditions
            ORDER BY name
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(db_conds) => Ok(db_conds
                .into_iter()
                .map(|dp| dp.into())
                .collect::<Vec<Condition>>()),
            Err(e) => {
                eprint!("Get genes error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_filtered_conditions(
        &self,
        filter: &FilterGroup<ConditionFieldName>,
    ) -> Result<Vec<Condition>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT
            name,
            description,
            male_mating,
            lethal,
            female_sterile,
            arrested,
            maturation_days
            FROM conditions",
        );
        filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<ConditionDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Filtered Condition error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_count_filtered_conditions(
        &self,
        filter: &FilterGroup<ConditionFieldName>,
    ) -> Result<u32, DbError> {
        let mut qb: QueryBuilder<Sqlite> =
            QueryBuilder::new("SELECT COUNT(*) as count FROM conditions");
        filter.add_filtered_query(&mut qb, true, false);

        match qb
            .build_query_as::<Count>()
            .fetch_one(&self.conn_pool)
            .await
        {
            Ok(count) => Ok(count.count),
            Err(e) => {
                eprint!("Get Conditions Count error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn get_altering_conditions(
        &self,
        expr_relation_filter: &FilterGroup<ExpressionRelationFieldName>,
        condition_filter: &FilterGroup<ConditionFieldName>,
    ) -> Result<Vec<Condition>, DbError> {
        let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "SELECT DISTINCT
            c.name,
            c.description,
            c.male_mating,
            c.lethal,
            c.female_sterile,
            c.arrested,
            c.maturation_days
          FROM
            (
              SELECT
                altering_condition AS ac
              FROM
                expr_relations",
        );
        expr_relation_filter.add_filtered_query(&mut qb, true, true);
        qb.push(
            ") JOIN conditions AS c 
            ON c.name == ac\n",
        );
        condition_filter.add_filtered_query(&mut qb, true, true);

        match qb
            .build_query_as::<ConditionDb>()
            .fetch_all(&self.conn_pool)
            .await
        {
            Ok(exprs) => Ok(exprs.into_iter().map(|e| e.into()).collect()),
            Err(e) => {
                eprint!("Get Altering Conditions error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_condition(&self, condition: &Condition) -> Result<(), DbError> {
        match sqlx::query!(
            "INSERT INTO conditions (name, description, male_mating, lethal, female_sterile, arrested, maturation_days)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            ",
            condition.name,
            condition.description,
            condition.male_mating,
            condition.lethal,
            condition.female_sterile,
            condition.arrested,
            condition.maturation_days,
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert Condition error: {e}");
                Err(DbError::Query(e.to_string()))
            }
        }
    }

    pub async fn insert_conditions(&self, bulk: Bulk<ConditionDb>) -> Result<(), DbError> {
        if !bulk.errors.is_empty() {
            return Err(DbError::BulkInsert(format!(
                "Found errors on {} lines",
                bulk.errors.len()
            )));
        }
        // 7 is the number of fields here
        let bind_limit = SQLITE_BIND_LIMIT / 7;
        let mut data = bulk.data.into_iter().peekable();
        while data.peek().is_some() {
            let mut qb: QueryBuilder<Sqlite> = QueryBuilder::new(
            "INSERT OR IGNORE INTO conditions (name, description, male_mating, lethal, female_sterile, arrested, maturation_days) "
        );
            let chunk = data.by_ref().take(bind_limit - 1).collect::<Vec<_>>();

            if chunk.len() > bind_limit {
                return Err(DbError::BulkInsert(format!(
                    "Row count exceeds max: {}",
                    bind_limit
                )));
            }

            qb.push_values(chunk, |mut b, item| {
                b.push_bind(item.name)
                    .push_bind(item.description)
                    .push_bind(item.male_mating)
                    .push_bind(item.lethal)
                    .push_bind(item.female_sterile)
                    .push_bind(item.arrested)
                    .push_bind(item.maturation_days);
            });

            match qb.build().execute(&self.conn_pool).await {
                Ok(_) => {}
                Err(e) => {
                    eprint!("Bulk Insert error: {e}");
                    return Err(DbError::BulkInsert(e.to_string()));
                }
            }
        }
        Ok(())
    }
}

#[cfg(test)]
mod test {

    use std::io::BufReader;

    use crate::dummy::testdata;
    use crate::interface::bulk::Bulk;
    use crate::models::condition::{Condition, ConditionDb, ConditionFieldName};
    use crate::models::expr_relation::ExpressionRelationFieldName;
    use crate::models::filter::{Filter, FilterGroup, Order};
    use crate::InnerDbState;
    use anyhow::Result;
    use pretty_assertions::assert_eq;
    use sqlx::{Pool, Sqlite};

    /* #region get_conditions test */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let conds = state.get_conditions().await?;

        let expected_conds = testdata::get_conditions();
        assert_eq!(conds, expected_conds);
        Ok(())
    }
    /* #endregion */

    /* #region get_filtered_conditions tests */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_conditions(&FilterGroup::<ConditionFieldName> {
                filters: vec![vec![(
                    ConditionFieldName::MaturationDays,
                    Filter::LessThan("4".to_owned(), false),
                )]],
                order_by: vec![(ConditionFieldName::Name, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, testdata::get_filtered_conditions());
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_conditions_desc(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_conditions(&FilterGroup::<ConditionFieldName> {
                filters: vec![vec![(
                    ConditionFieldName::MaturationDays,
                    Filter::LessThan("4".to_owned(), false),
                )]],
                order_by: vec![(ConditionFieldName::Name, Order::Desc)],
                limit: None,
                offset: None,
            })
            .await?;
        let mut fc = testdata::get_filtered_conditions();
        fc.reverse();
        assert_eq!(exprs, fc);
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_filtered_conditions_not_3_maturation_days(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_conditions(&FilterGroup::<ConditionFieldName> {
                filters: vec![vec![(
                    ConditionFieldName::MaturationDays,
                    Filter::NotEqual("3".to_owned()),
                )]],
                order_by: vec![(ConditionFieldName::Name, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(
            exprs,
            testdata::get_filtered_conditions_not_3_maturation_days()
        );
        Ok(())
    }

    #[sqlx::test(fixtures("dummy"))]
    async fn test_search_conditions_by_name(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let exprs = state
            .get_filtered_conditions(&FilterGroup::<ConditionFieldName> {
                filters: vec![vec![(
                    ConditionFieldName::Name,
                    Filter::Like("ami".to_owned()),
                )]],
                order_by: vec![(ConditionFieldName::Name, Order::Asc)],
                limit: None,
                offset: None,
            })
            .await?;

        assert_eq!(exprs, testdata::search_conditions_by_name());
        Ok(())
    }
    /* endregion get_filtered_conditions tests */

    /* #region get_altering_conditions test */
    #[sqlx::test(fixtures("dummy"))]
    async fn test_get_altering_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let expr_relation_filter = FilterGroup::<ExpressionRelationFieldName> {
            filters: vec![
                vec![(
                    ExpressionRelationFieldName::AlleleName,
                    Filter::Equal("n765".to_owned()),
                )],
                vec![(
                    ExpressionRelationFieldName::ExpressingPhenotypeName,
                    Filter::Equal("lin-15B".to_owned()),
                )],
                vec![(
                    ExpressionRelationFieldName::ExpressingPhenotypeWild,
                    Filter::False,
                )],
                vec![(ExpressionRelationFieldName::IsSuppressing, Filter::False)],
            ],
            order_by: vec![],
            limit: None,
            offset: None,
        };
        let condition_filter = FilterGroup::<ConditionFieldName> {
            filters: vec![],
            order_by: vec![(ConditionFieldName::Name, Order::Asc)],
            limit: None,
            offset: None,
        };

        let conditions = state
            .get_altering_conditions(&expr_relation_filter, &condition_filter)
            .await?;

        assert_eq!(conditions, testdata::get_altering_conditions());
        Ok(())
    }
    /* #endregion get_altering_conditions tests */

    /* #region insert_condition tests */
    #[sqlx::test]
    async fn test_insert_condition(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let conds = state.get_conditions().await?;
        assert_eq!(conds.len(), 0);

        let expected = Condition {
            name: "15C".to_string(),
            description: None,
            male_mating: Some(3),
            lethal: Some(false),
            female_sterile: Some(false),
            arrested: Some(false),
            maturation_days: Some(4.0),
        };

        state.insert_condition(&expected).await?;

        let conds = state.get_conditions().await?;
        assert_eq!(vec![expected], conds);
        Ok(())
    }
    /* #endregion */

    /* #region insert_conditions tests */
    #[sqlx::test]
    async fn test_insert_conditions(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let csv_str = "name,description,male_mating,lethal,female_sterile,arrested,maturation_days
15C,,3,0,0,0,4
25C,,3,0,0,0,3
Histamine,,3,0,0,0,3
Tetracycline,,3,0,0,0,3"
            .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new().has_headers(true).from_reader(buf);
        let bulk: Bulk<ConditionDb> = Bulk::from_reader(&mut reader);

        state.insert_conditions(bulk).await?;

        assert_eq!(state.get_conditions().await?, testdata::get_conditions());
        Ok(())
    }
    #[sqlx::test]
    async fn test_insert_conditions_tabs(pool: Pool<Sqlite>) -> Result<()> {
        let state = InnerDbState { conn_pool: pool };
        let csv_str =
            "name\tdescription\tmale_mating\tlethal\tfemale_sterile\tarrested\tmaturation_days
15C\t\t3\t0\t0\t0\t4
25C\t\t3\t0\t0\t0\t3
Histamine\t\t3\t0\t0\t0\t3
Tetracycline\t\t3\t0\t0\t0\t3"
                .as_bytes();
        let buf = BufReader::new(csv_str);
        let mut reader = csv::ReaderBuilder::new()
            .has_headers(true)
            .delimiter(b'\t')
            .from_reader(buf);
        let bulk: Bulk<ConditionDb> = Bulk::from_reader(&mut reader);

        state.insert_conditions(bulk).await?;

        assert_eq!(state.get_conditions().await?, testdata::get_conditions());
        Ok(())
    }
    /* #endregion */
}
