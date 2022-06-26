use std::path::PathBuf;

use dirs::home_dir;

/**
 * Returns the path to the config folder
 */
pub fn museeks_config_dir() -> PathBuf {
    home_dir().unwrap().join(".config").join("museeks") // TODO: automate that
}
