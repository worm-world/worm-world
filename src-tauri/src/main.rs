#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::{str::FromStr, time::Duration};

use anyhow::Result;
use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use sqlx::{
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous},
    Pool, Sqlite,
};
mod models;
use models::User;
use thiserror::Error;
use tokio::sync::RwLock;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

pub struct InnerDbState {
    conn_pool: Pool<Sqlite>,
}

impl InnerDbState {
    pub async fn get_users(&self) -> Result<Vec<User>, SqlQueryError> {
        match sqlx::query_as!(
            User,
            "
            SELECT u.id, u.user_name
            FROM Users u
            "
        )
        .fetch_all(&self.conn_pool)
        .await
        {
            Ok(users) => Ok(users),
            Err(_) => Err(SqlQueryError::SqlQueryError),
        }
        // return Ok(Vec::new());
    }
    pub async fn insert_user(&self, name: String) -> Result<(), SqlQueryError> {
        match sqlx::query!(
            "INSERT INTO Users (user_name)
            VALUES($1)
            ",
            name
        )
        .execute(&self.conn_pool)
        .await
        {
            Ok(_) => Ok(()),
            Err(e) => {
                eprint!("Insert User error: {e}");
                Err(SqlQueryError::SqlQueryError)
            }
        }
    }
}
pub struct DbState(pub RwLock<InnerDbState>);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_users(state: tauri::State<'_, DbState>) -> Result<Vec<User>, SqlQueryError> {
    let state_guard = state.0.read().await;
    state_guard.get_users().await
}

#[tauri::command]
async fn insert_user(state: tauri::State<'_, DbState>, name: String) -> Result<(), SqlQueryError> {
    let state_guard = state.0.read().await;
    state_guard.insert_user(name).await
}

#[derive(Error, Debug)]
pub enum SqlSetupError {
    #[error("Failed to get valid project data directory from OS")]
    NoProjectDir,
}

#[derive(Error, Debug, Serialize, Deserialize)]
pub enum SqlQueryError {
    #[error("Failed to execute query")]
    SqlQueryError,
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

    sqlx::migrate!("db/migrations").run(&sqlite_pool).await?;

    Ok(sqlite_pool)
}

#[tokio::main]
async fn main() {
    let pool = sqlite_setup()
        .await
        .expect("Failed to set up sqlite3 database.");

    tauri::Builder::default()
        .manage(DbState(RwLock::new(InnerDbState { conn_pool: pool })))
        .invoke_handler(tauri::generate_handler![greet, get_users, insert_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
