use tauri::{
    plugin::{Builder, TauriPlugin},
    AboutMetadata, CustomMenuItem, Menu, MenuItem, Runtime, Submenu,
};

/**
 * Build menu for the app
 * Stolen from Menu::os_default() + adaptations
 * https://github.com/tauri-apps/tauri/blob/4f855a8a8207fed20f3b21e63585abf295b1bc71/core/tauri-runtime/src/menu.rs#L241-L312
 */
pub fn get_initial_menu(app_name: &str) -> Menu {
    let mut menu = Menu::new();

    // let about_metadata = AboutMetadata::new()
    //     .version("0.20.0") // TODO: Automate all that?
    //     .authors(vec![String::from("Pierre de la Martinière")])
    //     .comments(String::from("comment"))
    //     .copyright(String::from("copyright"))
    //     .license(String::from("MIT"))
    //     .website(String::from("https://museeks.io"))
    //     .website_label(String::from("website"));

    println!("dedieu {}", app_name);
    #[cfg(target_os = "macos")]
    {
        menu = menu.add_submenu(Submenu::new(
            app_name,
            Menu::new()
                .add_native_item(MenuItem::About(
                    app_name.to_string(),
                    AboutMetadata::default(),
                    // about_metadata,
                ))
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Services)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Hide)
                .add_native_item(MenuItem::HideOthers)
                .add_native_item(MenuItem::ShowAll)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Quit),
        ));
    }

    let mut file_menu = Menu::new();
    file_menu = file_menu.add_native_item(MenuItem::CloseWindow);
    #[cfg(not(target_os = "macos"))]
    {
        file_menu = file_menu.add_native_item(MenuItem::Quit);
    }
    menu = menu.add_submenu(Submenu::new("File", file_menu));

    #[cfg(not(target_os = "linux"))]
    let mut edit_menu = Menu::new();
    #[cfg(target_os = "macos")]
    {
        edit_menu = edit_menu.add_native_item(MenuItem::Undo);
        edit_menu = edit_menu.add_native_item(MenuItem::Redo);
        edit_menu = edit_menu.add_native_item(MenuItem::Separator);
    }
    #[cfg(not(target_os = "linux"))]
    {
        edit_menu = edit_menu.add_native_item(MenuItem::Cut);
        edit_menu = edit_menu.add_native_item(MenuItem::Copy);
        edit_menu = edit_menu.add_native_item(MenuItem::Paste);
    }
    #[cfg(target_os = "macos")]
    {
        edit_menu = edit_menu.add_native_item(MenuItem::SelectAll);
    }
    #[cfg(not(target_os = "linux"))]
    {
        menu = menu.add_submenu(Submenu::new("Edit", edit_menu));
    }
    #[cfg(target_os = "macos")]
    {
        menu = menu.add_submenu(Submenu::new(
            "View",
            Menu::new()
                .add_item(
                    CustomMenuItem::new("jump_to_playing_track", "Jump To Playing Track").into(),
                )
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("go_to_library", "Go To Library").into())
                .add_item(CustomMenuItem::new("go_to_playlists", "Go To Playlists").into())
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("reload", "Reload").into())
                .add_item(CustomMenuItem::new("force_reload", "Force Reload").into())
                .add_item(CustomMenuItem::new("zoom_out", "Toggle Developer Tools").into())
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("zoom_reset", "Actual Size").into())
                .add_item(CustomMenuItem::new("zoom_in", "Zoom In").into())
                .add_item(CustomMenuItem::new("zoom_out", "Zoom In").into())
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::EnterFullScreen),
        ));
    }

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

    let mut window_menu = Menu::new();
    window_menu = window_menu.add_native_item(MenuItem::Minimize);
    #[cfg(target_os = "macos")]
    {
        window_menu = window_menu.add_native_item(MenuItem::Zoom);
        window_menu = window_menu.add_native_item(MenuItem::Separator);
    }
    window_menu = window_menu.add_native_item(MenuItem::CloseWindow);
    menu = menu.add_submenu(Submenu::new("Window", window_menu));

    menu
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
