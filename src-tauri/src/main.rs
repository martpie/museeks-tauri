#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[macro_use]
extern crate log;

use simple_logger;

mod commands;
mod constants;
mod integrations;
mod lib;

#[tokio::main]
async fn main() {
    // Init logger
    simple_logger::init_with_level(log::Level::Info).unwrap();

    // DB init
    // TODO: app path is unknown before tauri builder
    let db = lib::db::init().await.ok().unwrap();

    // Start Tauri
    tauri::Builder::default()
        .manage(lib::structs::AppState { db })
        .invoke_handler(tauri::generate_handler![
            commands::library::import,
            commands::library::get_songs,
            commands::window::show_main_window,
        ])
        .menu(integrations::menu::get_initial_menu())
        .plugin(integrations::menu::init())
        .setup(|_app| {
            // Nothing here yet!
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
