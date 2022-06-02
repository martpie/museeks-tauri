/**
 * Module in charge of persisting and returning the config to/from the filesystem
 */
use home_config::HomeConfig;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS)]
#[ts(export, export_to = "../src/generated/typings/Config.ts")]
struct Config {
    pub theme: String,
    pub audio_volume: u8,
    pub audio_playback_rate: u8,
    pub audio_output_device: String,
    pub audio_muted: bool,
    pub audio_shuffle: bool,
    pub audio_repeat: String,       // Repeat enum
    pub default_view: String,       // TODO: enum?
    pub library_sort_by: String,    // SortBy enum
    pub library_sort_order: String, // SortOrder enum
    pub music_folders: Vec<String>,
    pub sleep_blocker: bool,
    pub auto_update_checker: bool,
    pub minimize_to_tray: bool,
    pub notifications: bool,
}

impl Config {
    pub fn default() -> Self {
        Config {
            theme: "__system".into(),
            audio_volume: 1,
            audio_playback_rate: 1,
            audio_output_device: "default".into(),
            audio_muted: false,
            audio_shuffle: false,
            audio_repeat: "none".into(),
            default_view: "library".into(),
            library_sort_by: "artist".into(),
            library_sort_order: "asc".into(),
            music_folders: vec![],
            sleep_blocker: false,
            auto_update_checker: true,
            minimize_to_tray: false,
            notifications: false,
        }
    }
}

pub async fn init() -> HomeConfig {
    let conf = HomeConfig::new("museeks", "config.toml");

    let existing_config = conf.toml::<Config>();

    if existing_config.is_err() {
        // The config does not exist, so let's instantiate it with defaults
        // Potential issue: if the config is extended, the defaults will be
        // reloaded
        let default_config = Config::default();
        conf.save_toml(&default_config).unwrap();
    }

    return conf;
}
