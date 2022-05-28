use std::ffi::OsStr;
use walkdir::{DirEntry, WalkDir};

/**
 * Check if a directory or a file is visible or not
 */
fn is_dir_visible(entry: &DirEntry) -> bool {
    entry
        .file_name()
        .to_str()
        .map(|s| !s.starts_with("."))
        .unwrap_or(false)
}

/**
 * Take an entry and filter out:
 *   - directories
 *   - non-allowed extensions
 *
 */
fn is_entry_valid(
    result: std::result::Result<walkdir::DirEntry, walkdir::Error>,
    allowed_extensions: &[&str],
) -> Option<String> {
    // If the user does not have access to the file
    if result.is_err() {
        return None;
    }

    let entry = result.unwrap();
    let file_type = entry.file_type();

    let extension = entry
        .path()
        .extension()
        .and_then(OsStr::to_str)
        .unwrap_or("");

    let is_file = file_type.is_file();
    let has_valid_extension = allowed_extensions.contains(&extension);

    if is_file && has_valid_extension {
        // Only return the file path, that's what we're interested in
        return entry.path().to_str().map(str::to_string);
    }

    return None;
}

/**
 * Scan directory and filter files by extension
 *
 * TODO: support multiple directories scan at once
 */
pub fn scan_dir(path: String, allowed_extensions: &[&str]) -> Vec<String> {
    let songs_path = WalkDir::new(path)
        .follow_links(true)
        .into_iter()
        .filter_entry(|entry| is_dir_visible(entry))
        .filter_map(|entry| is_entry_valid(entry, allowed_extensions))
        .collect();

    return songs_path;
}
