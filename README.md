# WormWorld

A tool to facilitate the creation and tracking of formula-like written derivations of worm genomes that trace the inheritance of relevant genes across generations according to known statistical patterns and biological rules.

## Getting started

1. Install [Node](https://nodejs.org/en/download/)
2. Install [Rust](https://www.rust-lang.org/tools/install)
3. Install the `sqlx` CLI by running `cargo install sqlx-cli`
4. Run `npm run tauri dev`.
5. On the first run above, the database URL is printed out.
   It looks like `sqlite:///<ABSOLUTE PATH TO DB>`.
    Create a `.env` file in the `src-tauri/` folder and add `DATABASE_URL="<THAT DATABASE URL>"` (using the URL format from above *including* the `sqlite:///`). On Windows, you may need to switch the slash directions.

    > On the first run, we rely on the `sqlx-data.json` file for the database schema info. Once `DATABASE_URL` is specified, it actually queries the database at compile time for the schema. When making schema changes in the database, after you've run a program with new migrations, run `cargo sqlx prepare` to sync that file with the actual schema of the database. This could be a good thing to check in CI/CD with `cargo sqlx prepare --check`.

## Notable Scripts

You can view all available scripts in `package.json`.
- `npm run tauri dev` runs the frontend and backend together
- `npm run test-all` tests the frontend (`vitest`) and backend (`cargo test`)

## Info
Right now, there are models in 3 places:
1. `src/models/`: This folder has the frontend type models
2. `src-tauri/src/models.rs`: This file has the backend type models. 
   > Notice the `serde(rename)` decorators that keep the field names consistent between frontend and backend for (de)serialization.
3. `src-tauri/db/migrations/`: This folder holds the SQL migrations.
   The files here should be created with `sqlx migrate add -r <name>`, then you can edit the up and down SQL files.
   - The up commands are run automatically in the `migrate!` method in the program or with `sqlx migrate run`.
   - The down commands are only relevant for us in development. You can run `sqlx migrate revert`



