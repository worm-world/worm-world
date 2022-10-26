fn main() {
    println!("cargo:rerun-if-changed=db/migrations");
    tauri_build::build()
}