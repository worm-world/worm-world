#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use anyhow::Result;
use directories::ProjectDirs;
use sqlx::{
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous},
    Pool, Sqlite,
};
use std::{path::Path, str::FromStr, time::Duration};
use thiserror::Error;
use tokio::sync::RwLock;

mod interface;
use interface::{bulk::Bulk, DbError, InnerDbState};

mod models;
use models::{
    allele::{Allele, AlleleFieldName},
    allele_expr::{AlleleExpression, AlleleExpressionDb, AlleleExpressionFieldName},
    condition::{Condition, ConditionDb, ConditionFieldName},
    expr_relation::{ExpressionRelation, ExpressionRelationDb, ExpressionRelationFieldName},
    filter::FilterGroup,
    gene::{Gene, GeneDb, GeneFieldName},
    phenotype::{Phenotype, PhenotypeDb, PhenotypeFieldName},
    strain::{Strain, StrainFieldName},
    strain_allele::{StrainAllele, StrainAlleleFieldName},
    task::{Task, TaskFieldName},
    task_cond::{TaskCondition, TaskConditionFieldName},
    task_dep::{TaskDependency, TaskDependencyFieldName},
    tree::{Tree, TreeFieldName},
    variation::{Variation, VariationDb, VariationFieldName},
};

#[tokio::main]
async fn main() {
    let pool = sqlite_setup()
        .await
        .expect("Failed to set up sqlite3 database.");

    tauri::Builder::default()
        .manage(DbState(RwLock::new(InnerDbState { conn_pool: pool })))
        .invoke_handler(tauri::generate_handler![
            // genes
            get_genes,
            get_filtered_genes,
            get_count_filtered_genes,
            insert_gene,
            insert_genes_from_file,
            delete_filtered_genes,
            // conditions
            get_conditions,
            get_filtered_conditions,
            get_count_filtered_conditions,
            get_altering_conditions,
            insert_condition,
            insert_conditions_from_file,
            delete_filtered_conditions,
            // phenotypes
            get_phenotypes,
            get_filtered_phenotypes,
            get_count_filtered_phenotypes,
            get_altering_phenotypes,
            insert_phenotype,
            insert_phenotypes_from_file,
            delete_filtered_phenotypes,
            // variations
            get_variations,
            get_filtered_variations,
            get_count_filtered_variations,
            insert_variation,
            insert_variations_from_file,
            delete_filtered_variations,
            // allele_exprs
            get_allele_exprs,
            get_filtered_allele_exprs,
            get_count_filtered_allele_exprs,
            insert_allele_expr,
            insert_allele_exprs_from_file,
            delete_filtered_allele_exprs,
            // alleles
            get_alleles,
            get_filtered_alleles,
            get_count_filtered_alleles,
            get_filtered_alleles_with_gene_filter,
            insert_allele,
            insert_alleles_from_file,
            delete_filtered_alleles,
            // expr_relations
            get_expr_relations,
            get_filtered_expr_relations,
            get_count_filtered_expr_relations,
            insert_expr_relation,
            insert_expr_relations_from_file,
            delete_filtered_expr_relations,
            // tasks
            get_tasks,
            get_filtered_tasks,
            insert_task,
            update_task,
            delete_task,
            delete_tasks,
            delete_all_tasks,
            // trees
            get_trees,
            get_filtered_trees,
            insert_tree,
            update_tree,
            delete_tree,
            // task conditions/dependencies
            get_task_conditions,
            get_filtered_task_conditions,
            get_count_filtered_conditions,
            insert_task_condition,
            get_task_dependencies,
            get_filtered_task_dependency,
            insert_task_dependency,
            // strains
            get_strains,
            get_filtered_strains,
            get_count_filtered_strains,
            insert_strain,
            insert_strains_from_file,
            update_strain,
            delete_filtered_strains,
            // strain_alleles,
            get_strain_alleles,
            get_filtered_strain_alleles,
            get_count_filtered_strain_alleles,
            insert_strain_allele,
            insert_strain_alleles_from_file,
            delete_filtered_strain_alleles,
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

/* #region genes */
#[tauri::command]
async fn get_genes(state: tauri::State<'_, DbState>) -> Result<Vec<Gene>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_genes().await
}

#[tauri::command]
async fn get_filtered_genes(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<GeneFieldName>,
) -> Result<Vec<Gene>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_genes(&filter).await
}

#[tauri::command]
async fn get_count_filtered_genes(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<GeneFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_genes(&filter).await
}

#[tauri::command]
async fn insert_gene(state: tauri::State<'_, DbState>, gene: Gene) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_gene(&gene).await
}

#[tauri::command]
async fn insert_genes_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<GeneDb>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_genes(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}

#[tauri::command]
async fn delete_filtered_genes(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<GeneFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_genes(&filter).await
}
/* #endregion genes */

/* #region conditions */
#[tauri::command]
async fn get_conditions(state: tauri::State<'_, DbState>) -> Result<Vec<Condition>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_conditions().await
}

#[tauri::command]
async fn get_filtered_conditions(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<ConditionFieldName>,
) -> Result<Vec<Condition>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_conditions(&filter).await
}

#[tauri::command]
async fn get_count_filtered_conditions(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<ConditionFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_conditions(&filter).await
}

#[tauri::command]
async fn get_altering_conditions(
    state: tauri::State<'_, DbState>,
    expr_relation_filter: FilterGroup<ExpressionRelationFieldName>,
    condition_filter: FilterGroup<ConditionFieldName>,
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
async fn insert_conditions_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<ConditionDb>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_conditions(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}

#[tauri::command]
async fn delete_filtered_conditions(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<ConditionFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_conditions(&filter).await
}
/* #endregion conditions */

/* #region phenotypes */
#[tauri::command]
async fn get_phenotypes(state: tauri::State<'_, DbState>) -> Result<Vec<Phenotype>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_phenotypes().await
}

#[tauri::command]
async fn get_filtered_phenotypes(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<PhenotypeFieldName>,
) -> Result<Vec<Phenotype>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_phenotypes(&filter).await
}

#[tauri::command]
async fn get_count_filtered_phenotypes(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<PhenotypeFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_phenotypes(&filter).await
}

#[tauri::command]
async fn get_altering_phenotypes(
    state: tauri::State<'_, DbState>,
    expr_relation_filter: FilterGroup<ExpressionRelationFieldName>,
    phenotype_filter: FilterGroup<PhenotypeFieldName>,
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
async fn insert_phenotypes_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<PhenotypeDb>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_phenotypes(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}
#[tauri::command]
async fn delete_filtered_phenotypes(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<PhenotypeFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_phenotypes(&filter).await
}
/* #endregion phenotypes */

/* #region variations */
#[tauri::command]
async fn get_variations(state: tauri::State<'_, DbState>) -> Result<Vec<Variation>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_variations().await
}

#[tauri::command]
async fn get_filtered_variations(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<VariationFieldName>,
) -> Result<Vec<Variation>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_variations(&filter).await
}

#[tauri::command]
async fn get_count_filtered_variations(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<VariationFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_variations(&filter).await
}

#[tauri::command]
async fn insert_variation(
    state: tauri::State<'_, DbState>,
    variation: Variation,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_variation(&variation).await
}

#[tauri::command]
async fn insert_variations_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<VariationDb>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_variations(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}

#[tauri::command]
async fn delete_filtered_variations(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<VariationFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_variations(&filter).await
}
/* #endregion variations */

/* #region allele_exprs */
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
    filter: FilterGroup<AlleleExpressionFieldName>,
) -> Result<Vec<AlleleExpression>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_allele_exprs(&filter).await
}

#[tauri::command]
async fn get_count_filtered_allele_exprs(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<AlleleExpressionFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_allele_exprs(&filter).await
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
async fn insert_allele_exprs_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<AlleleExpressionDb>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_allele_exprs(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}

#[tauri::command]
async fn delete_filtered_allele_exprs(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<AlleleExpressionFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_allele_exprs(&filter).await
}

#[tauri::command]
async fn get_alleles(state: tauri::State<'_, DbState>) -> Result<Vec<Allele>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_alleles().await
}

#[tauri::command]
async fn get_filtered_alleles(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<AlleleFieldName>,
) -> Result<Vec<Allele>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_alleles(&filter).await
}

#[tauri::command]
async fn get_count_filtered_alleles(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<AlleleFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_alleles(&filter).await
}

#[tauri::command]
async fn get_filtered_alleles_with_gene_filter(
    state: tauri::State<'_, DbState>,
    allele_filter: FilterGroup<AlleleFieldName>,
    gene_filter: FilterGroup<GeneFieldName>,
) -> Result<Vec<(Allele, Gene)>, DbError> {
    let state_guard = state.0.read().await;
    state_guard
        .get_filtered_alleles_with_gene_filter(&allele_filter, &gene_filter)
        .await
}

#[tauri::command]
async fn insert_allele(state: tauri::State<'_, DbState>, allele: Allele) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_allele(&allele).await
}

#[tauri::command]
async fn insert_alleles_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<Allele>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_alleles(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}

#[tauri::command]
async fn delete_filtered_alleles(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<AlleleFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_alleles(&filter).await
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
    filter: FilterGroup<ExpressionRelationFieldName>,
) -> Result<Vec<ExpressionRelation>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_expr_relations(&filter).await
}

#[tauri::command]
async fn get_count_filtered_expr_relations(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<ExpressionRelationFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_expr_relations(&filter).await
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
async fn insert_expr_relations_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<ExpressionRelationDb>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_expr_relations(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}
#[tauri::command]
async fn delete_filtered_expr_relations(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<ExpressionRelationFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_expr_relations(&filter).await
}

#[tauri::command]
async fn get_tasks(state: tauri::State<'_, DbState>) -> Result<Vec<Task>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_tasks().await
}

#[tauri::command]
async fn get_filtered_tasks(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<TaskFieldName>,
) -> Result<Vec<Task>, DbError> {
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
async fn delete_task(state: tauri::State<'_, DbState>, id: String) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_task(id).await
}

#[tauri::command]
async fn delete_tasks(state: tauri::State<'_, DbState>, tree: String) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_tasks(tree).await
}

#[tauri::command]
async fn delete_all_tasks(state: tauri::State<'_, DbState>) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_all_tasks().await
}

#[tauri::command]
async fn get_trees(state: tauri::State<'_, DbState>) -> Result<Vec<Tree>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_trees().await
}

#[tauri::command]
async fn get_filtered_trees(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<TreeFieldName>,
) -> Result<Vec<Tree>, DbError> {
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

#[tauri::command]
async fn delete_tree(state: tauri::State<'_, DbState>, id: String) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_tree(id).await
}

#[tauri::command]
async fn get_task_conditions(
    state: tauri::State<'_, DbState>,
) -> Result<Vec<TaskCondition>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_task_conditions().await
}

#[tauri::command]
async fn get_filtered_task_conditions(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<TaskConditionFieldName>,
) -> Result<Vec<TaskCondition>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_task_conditions(&filter).await
}

#[tauri::command]
async fn insert_task_condition(
    state: tauri::State<'_, DbState>,
    task: TaskCondition,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_task_condition(&task).await
}

#[tauri::command]
async fn get_task_dependencies(
    state: tauri::State<'_, DbState>,
) -> Result<Vec<TaskDependency>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_task_dependencies().await
}

#[tauri::command]
async fn get_filtered_task_dependency(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<TaskDependencyFieldName>,
) -> Result<Vec<TaskDependency>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_task_dependency(&filter).await
}

#[tauri::command]
async fn insert_task_dependency(
    state: tauri::State<'_, DbState>,
    task: TaskDependency,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_task_dependency(&task).await
}

#[tauri::command]
async fn get_strains(state: tauri::State<'_, DbState>) -> Result<Vec<Strain>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_strains().await
}

#[tauri::command]
async fn get_count_filtered_strains(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<StrainFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_strains(&filter).await
}

#[tauri::command]
async fn get_filtered_strains(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<StrainFieldName>,
) -> Result<Vec<Strain>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_strains(&filter).await
}

#[tauri::command]
async fn insert_strain(state: tauri::State<'_, DbState>, strain: Strain) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_strain(&strain).await
}

#[tauri::command]
async fn insert_strains_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<Strain>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_strains(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}

#[tauri::command]
async fn update_strain(
    state: tauri::State<'_, DbState>,
    name: String,
    new_strain: Strain,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.update_strain(name, new_strain).await
}

#[tauri::command]
async fn delete_filtered_strains(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<StrainFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_strains(&filter).await
}
/* #endregion strains */

/* #region strain_alleles */
#[tauri::command]
async fn get_strain_alleles(
    state: tauri::State<'_, DbState>,
) -> Result<Vec<StrainAllele>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_strain_alleles().await
}

#[tauri::command]
async fn get_count_filtered_strain_alleles(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<StrainAlleleFieldName>,
) -> Result<u32, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_count_filtered_strain_alleles(&filter).await
}

#[tauri::command]
async fn get_filtered_strain_alleles(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<StrainAlleleFieldName>,
) -> Result<Vec<StrainAllele>, DbError> {
    let state_guard = state.0.read().await;
    state_guard.get_filtered_strain_alleles(&filter).await
}

#[tauri::command]
async fn insert_strain_allele(
    state: tauri::State<'_, DbState>,
    strain_allele: StrainAllele,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.insert_strain_allele(&strain_allele).await
}

#[tauri::command]
async fn insert_strain_alleles_from_file(
    state: tauri::State<'_, DbState>,
    path: String,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    match Bulk::<StrainAllele>::new(Path::new(&path)) {
        Ok(bulk) => state_guard.insert_strain_alleles(bulk).await,
        Err(_) => Err(DbError::BulkInsert("Unable to open file".to_owned())),
    }
}

#[tauri::command]
async fn delete_filtered_strain_alleles(
    state: tauri::State<'_, DbState>,
    filter: FilterGroup<StrainAlleleFieldName>,
) -> Result<(), DbError> {
    let state_guard = state.0.read().await;
    state_guard.delete_filtered_strain_alleles(&filter).await
}
