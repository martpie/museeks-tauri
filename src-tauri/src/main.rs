#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate log;

use simple_logger;
use tauri::Manager;

mod commands;
mod constants;
mod integrations;
mod lib;

const APP_NAME: &str = "Museeks"; // TODO use app.package instead

#[tokio::main]
async fn main() {
    // Init logger
    simple_logger::init_with_level(log::Level::Info).unwrap();

    // DB init
    // TODO: app path is unknown before tauri builder
    let db = lib::db::init().await.ok().unwrap();

    // Config init
    let config = lib::config::init().await;

    // Start Tauri
    tauri::Builder::default()
        .manage(lib::structs::AppState { db, config })
        .invoke_handler(tauri::generate_handler![
            commands::library::import,
            commands::library::get_songs,
            commands::window::show_main_window,
            lib::config::get_config
        ])
        .menu(integrations::menu::get_initial_menu(APP_NAME))
        .plugin(integrations::menu::init())
        .setup(|app| {
            let _handle = app.app_handle();

            // Nothing here yet!
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
