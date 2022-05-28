use tauri::{
    plugin::{Builder, TauriPlugin},
    AboutMetadata, Menu, MenuItem, Runtime, Submenu,
};

const APP_NAME: &str = "Museeks"; // TODO use app.package instead

// #[tauri::command]
// this will be accessible with `invoke('plugin:awesome|initialize')`.
// where `awesome` is the plugin name.
pub fn get_initial_menu() -> Menu {
    let about_metadata = AboutMetadata::new()
        .version("0.20.0") // TODO: Automate all that?
        .authors(vec![String::from("Pierre de la Martinière")])
        .comments(String::from("comment"))
        .copyright(String::from("copyright"))
        .license(String::from("MIT"))
        .website(String::from("https://museeks.io"))
        .website_label(String::from("website"));

    let menu = Menu::with_items([
        Submenu::new("USELESS", Menu::new()).into(),
        Submenu::new(
            APP_NAME,
            Menu::new()
                .add_native_item(MenuItem::About(String::from(APP_NAME), about_metadata))
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Services)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Hide)
                .add_native_item(MenuItem::HideOthers)
                .add_native_item(MenuItem::ShowAll)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Quit),
        )
        .into(),
        Submenu::new("File", Menu::new().add_native_item(MenuItem::CloseWindow)).into(),
        Submenu::new(
            "Edit",
            Menu::new()
                .add_native_item(MenuItem::Undo)
                .add_native_item(MenuItem::Redo)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Cut)
                .add_native_item(MenuItem::Copy)
                .add_native_item(MenuItem::Paste)
                .add_native_item(MenuItem::SelectAll),
        )
        .into(),
        Submenu::new(
            "View",
            Menu::new()
                // TODO:
                // - jump to song
                // - separator
                // - go to library
                // - go to playlists
                // - separator
                // - reload
                // - force reload
                // - toggle developer tools
                // - separator
                // - actual size
                // - zoom in
                // - zoom out
                // - actual
                .add_native_item(MenuItem::EnterFullScreen),
        )
        .into(),
        Submenu::new(
            "Window",
            Menu::new()
                .add_native_item(MenuItem::Minimize)
                .add_native_item(MenuItem::Zoom),
        )
        .into(),
        Submenu::new("Help", Menu::new()).into(),
    ]);

    return menu;
}

/**
 * The actual plugin
 */
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("menu")
        .invoke_handler(tauri::generate_handler![])
        .setup(|_app_handle| {
            // let main_window = app_handle.get_window("main").unwrap();
            // let menu_handle = main_window.menu_handle();

            // TODO: ow set to set menu here?

            Ok(())
        })
        .build()
}
