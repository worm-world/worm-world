#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::{str::FromStr, time::Duration};

use anyhow::Result;
use directories::ProjectDirs;
use sqlx::{
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous},
    Pool, Sqlite,
};

mod dummy;
mod models;

use models::{
    allele::{Allele, AlleleFieldName},
    allele_expr::{AlleleExpression, AlleleExpressionFieldName},
    condition::{Condition, ConditionFieldName},
    expr_relation::{ExpressionRelation, ExpressionRelationFieldName},
    filter::Filter,
    gene::{Gene, GeneFieldName},
    task::{Task, TaskFieldName},
    phenotype::{Phenotype, PhenotypeFieldName},
    variation_info::{VariationFieldName, VariationInfo}, tree::{Tree, TreeFieldName},
};
use thiserror::Error;
use tokio::sync::RwLock;

mod interface;
use interface::{DbError, InnerDbState};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tokio::main]
async fn main() {
    let pool = sqlite_setup()
        .await
        .expect("Failed to set up sqlite3 database.");

    tauri::Builder::default()
        .manage(DbState(RwLock::new(InnerDbState { conn_pool: pool })))
        .invoke_handler(tauri::generate_handler![
            get_genes,
            get_filtered_genes,
            insert_gene,
            get_conditions,
            get_filtered_conditions,
            get_altering_conditions,
            insert_condition,
            get_phenotypes,
            get_filtered_phenotypes,
            get_altering_phenotypes,
            insert_phenotype,
            get_variation_info,
            get_filtered_variation_info,
            insert_variation_info,
            get_allele_exprs,
            get_filtered_allele_exprs,
            insert_allele_expr,
            get_alleles,
            get_filtered_alleles,
            insert_allele,
            get_expr_relations,
            get_filtered_expr_relations,
            insert_expr_relation,
            get_tasks,
            get_filtered_tasks,
            insert_task,
            update_task,
            get_trees,
            get_filtered_trees,
            insert_tree,
            update_tree,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

pub struct DbState(pub RwLock<InnerDbState>);

#[derive(Error, Debug)]
pub enum SqlSetupError {
    #[error("Failed to get valid project data directory from OS")]
    NoProjectDir,
}

async fn sqlite_setup() -> Result<Pool<Sqlite>> {
    let proj_dirs =
        ProjectDirs::from("edu", "UofUBiology", "WormWorld").ok_or(SqlSetupError::NoProjectDir)?;
    let database_dir = proj_dirs.data_dir().join("db");
    std::fs::create_dir_all(database_dir.clone())?;

    let database_url = format!(
        "sqlite:///{}",
        database_dir.join("worm.sqlite").to_str().unwrap()
    );
    println!("{}", database_url);

    let pool_timeout = Duration::from_secs(30);
    let connection_options = SqliteConnectOptions::from_str(&database_url)?
        .create_if_missing(true)
        .journal_mode(SqliteJournalMode::Wal)
        .synchronous(SqliteSynchronous::Normal)
        .busy_timeout(pool_timeout);

    let sqlite_pool = SqlitePoolOptions::new()
        .max_connections(100)
        .acquire_timeout(pool_timeout)
        .connect_with(connection_options)
        .await?;

    sqlx::migrate!().run(&sqlite_pool).await?;

    Ok(sqlite_pool)
}

#[tauri::command]
async fn get_genes(state: tauri::State<'_, DbState>) -> Result<Vec<Gene>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_genes().await
}

#[tauri::command]
async fn get_filtered_genes(
    state: tauri::State<'_, DbState>,
    filter: Filter<GeneFieldName>,
) -> Result<Vec<Gene>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_genes(&filter).await
}

#[tauri::command]
async fn insert_gene(state: tauri::State<'_, DbState>, gene: Gene) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_gene(&gene).await
}

#[tauri::command]
async fn get_conditions(state: tauri::State<'_, DbState>) -> Result<Vec<Condition>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_conditions().await
}

#[tauri::command]
async fn get_filtered_conditions(
    state: tauri::State<'_, DbState>,
    filter: Filter<ConditionFieldName>,
) -> Result<Vec<Condition>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_conditions(&filter).await
}

#[tauri::command]
async fn get_altering_conditions(
    state: tauri::State<'_, DbState>,
    expr_relation_filter: Filter<ExpressionRelationFieldName>,
    condition_filter: Filter<ConditionFieldName>,
) -> Result<Vec<Condition>, DbError> {
    let state_guard = state.0.read().await;
    state_guard
        .get_altering_conditions(&expr_relation_filter, &condition_filter)
        .await
}

#[tauri::command]
async fn insert_condition(
    state: tauri::State<'_, DbState>,
    condition: Condition,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_condition(&condition).await
}

#[tauri::command]
async fn get_phenotypes(state: tauri::State<'_, DbState>) -> Result<Vec<Phenotype>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_phenotypes().await
}

#[tauri::command]
async fn get_filtered_phenotypes(
    state: tauri::State<'_, DbState>,
    filter: Filter<PhenotypeFieldName>,
) -> Result<Vec<Phenotype>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_phenotypes(&filter).await
}

#[tauri::command]
async fn get_altering_phenotypes(
    state: tauri::State<'_, DbState>,
    expr_relation_filter: Filter<ExpressionRelationFieldName>,
    phenotype_filter: Filter<PhenotypeFieldName>,
) -> Result<Vec<Phenotype>, DbError> {
    let state_guard = state.0.read().await;
    state_guard
        .get_altering_phenotypes(&expr_relation_filter, &phenotype_filter)
        .await
}

#[tauri::command]
async fn insert_phenotype(
    state: tauri::State<'_, DbState>,
    phenotype: Phenotype,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_phenotype(&phenotype).await
}

#[tauri::command]
async fn get_variation_info(
    state: tauri::State<'_, DbState>,
) -> Result<Vec<VariationInfo>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_variation_info().await
}

#[tauri::command]
async fn get_filtered_variation_info(
    state: tauri::State<'_, DbState>,
    filter: Filter<VariationFieldName>,
) -> Result<Vec<VariationInfo>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_variation_info(&filter).await
}

#[tauri::command]
async fn insert_variation_info(
    state: tauri::State<'_, DbState>,
    variation_info: VariationInfo,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_variation_info(&variation_info).await
}

#[tauri::command]
async fn get_allele_exprs(
    state: tauri::State<'_, DbState>,
) -> Result<Vec<AlleleExpression>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_allele_exprs().await
}

#[tauri::command]
async fn get_filtered_allele_exprs(
    state: tauri::State<'_, DbState>,
    filter: Filter<AlleleExpressionFieldName>,
) -> Result<Vec<AlleleExpression>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_allele_exprs(&filter).await
}

#[tauri::command]
async fn insert_allele_expr(
    state: tauri::State<'_, DbState>,
    allele_expr: AlleleExpression,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_allele_expr(&allele_expr).await
}

#[tauri::command]
async fn get_alleles(state: tauri::State<'_, DbState>) -> Result<Vec<Allele>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_alleles().await
}

#[tauri::command]
async fn get_filtered_alleles(
    state: tauri::State<'_, DbState>,
    filter: Filter<AlleleFieldName>,
) -> Result<Vec<Allele>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_alleles(&filter).await
}

#[tauri::command]
async fn insert_allele(state: tauri::State<'_, DbState>, allele: Allele) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_allele(&allele).await
}

#[tauri::command]
async fn get_expr_relations(
    state: tauri::State<'_, DbState>,
) -> Result<Vec<ExpressionRelation>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_expr_relations().await
}

#[tauri::command]
async fn get_filtered_expr_relations(
    state: tauri::State<'_, DbState>,
    filter: Filter<ExpressionRelationFieldName>,
) -> Result<Vec<ExpressionRelation>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_expr_relations(&filter).await
}

#[tauri::command]
async fn insert_expr_relation(
    state: tauri::State<'_, DbState>,
    expr_relation: ExpressionRelation,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_expr_relation(&expr_relation).await
}

#[tauri::command]
async fn get_tasks(state: tauri::State<'_, DbState>) -> Result<Vec<Task>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_tasks().await
}

#[tauri::command]
async fn get_filtered_tasks(state: tauri::State<'_, DbState>, filter: Filter<TaskFieldName>) -> Result<Vec<Task>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_tasks(&filter).await
}
#[tauri::command]
async fn insert_task(state: tauri::State<'_, DbState>, task: Task) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_task(&task).await
}

#[tauri::command]
async fn update_task(state: tauri::State<'_, DbState>, task: Task) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.update_task(&task).await
}

#[tauri::command]
async fn get_trees(state: tauri::State<'_, DbState>) -> Result<Vec<Tree>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_trees().await
}

#[tauri::command]
async fn get_filtered_trees(state: tauri::State<'_, DbState>, filter: Filter<TreeFieldName>) -> Result<Vec<Tree>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_trees(&filter).await
}
#[tauri::command]
async fn insert_tree(state: tauri::State<'_, DbState>, tree: Tree) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_tree(&tree).await
}

#[tauri::command]
async fn update_tree(state: tauri::State<'_, DbState>, tree: Tree) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.update_tree(&tree).await
}