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

mod models;
mod dummy;

use models::gene::Gene;
use thiserror::Error;
use tokio::sync::RwLock;

mod bindings;
use bindings::{SqlQueryError, InnerDbState};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


pub struct DbState(pub RwLock<InnerDbState>);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_genes(state: tauri::State<'_, DbState>) -> Result<Vec<Gene>, SqlQueryError> {
    let state_guard = state.0.read().await;
    state_guard.get_genes().await
}


#[tauri::command]
async fn insert_gene(state: tauri::State<'_, DbState>, gene: Gene) -> Result<(), SqlQueryError> {
    let state_guard = state.0.read().await;
    state_guard.insert_gene(gene).await
}

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
        database_dir.join("exampledb.sqlite").to_str().unwrap()
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

#[tokio::main]
async fn main() {
    let pool = sqlite_setup()
        .await
        .expect("Failed to set up sqlite3 database.");

    tauri::Builder::default()
        .manage(DbState(RwLock::new(InnerDbState { conn_pool: pool })))
        .invoke_handler(tauri::generate_handler![greet, get_genes, insert_gene])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
