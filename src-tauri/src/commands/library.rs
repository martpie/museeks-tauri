/**
 * List of Tauri commands related to library management
 */
use futures::stream::{self, StreamExt};
use futures::Future;
use id3::{Tag, TagLike};
use std::time::Instant;
use tauri::{api, Manager, State, Window};

use crate::constants;
use crate::lib::db::{self, insert_track};
use crate::lib::fs_utils;
use crate::lib::structs::{AppState, Document, NumberOf, Track};

const SCAN_CONCURRENCY: usize = 32;

/**
 * Scan a folder and extract all ID3 tags from it
 *
 * TODO: Make it accept a Vector of String instead
 */
#[tauri::command]
pub async fn scan(
    state: State<'_, AppState>,
    window: Window,
    import_path: String,
) -> Result<Vec<Document<Track>>, String> {
    info!("Importing path {}", import_path);

    let paths = fs_utils::scan_dir(import_path, &constants::SUPPORTED_TRACKS_EXTENSIONS);

    let task_count = paths.len();

    // Let's get all tracks ID3
    info!("Importing {} files...", task_count);
    let id3_start_time = Instant::now();

    let mut tracks: Vec<Track> = vec![];

    for path in paths {
        let result = Tag::read_from_path(&path);
        let saved_path = path.to_string(); // Why do I need to copy this?

        if result.is_ok() {
            let tags = result.unwrap();

            // let test = tag.get("TPE1").and_then(|frame| frame.text_values());

            let track = Track {
                title: tags.title().unwrap_or("Unkown").to_string(),
                album: tags.album().unwrap_or("Unknown").to_string(),
                artists: vec![tags.artist().unwrap_or("Unkown artist").to_string()], // TODO: multiple artists here
                genre: vec![(tags.genre().unwrap_or("").to_string())], // TODO: multiple genres here
                year: tags.year(),
                duration: tags.duration().unwrap_or(0),
                track: NumberOf { no: None, of: None },
                disk: NumberOf { no: None, of: None },
                path,
            };

            tracks.push(track)
            // let insertion_result = db::insert_track(&state.db.tracks, track).await;

            // if insertion_result.is_err() {
            //     warn!("Could not insert track from file {}", saved_path);
            // }
        } else {
            warn!("Failed to get ID3 tags for file {}", saved_path);
        }
    }
    let id3_duration = id3_start_time.elapsed();
    info!("{} tracks succesfully scanned", tracks.len());
    info!("Scanned all id3 tags: {:.2?}", id3_duration);

    let db_start_time = Instant::now();
    // SLOW, WHY?
    // let scan_stream = stream::iter(tracks);
    // let future = scan_stream.for_each_concurrent(SCAN_CONCURRENCY, |track| async {
    for track in tracks {
        let insertion_result = db::insert_track(&state.db.tracks, track).await;

        if insertion_result.is_err() {
            warn!("Could not insert track from file");
        }
    }
    // });

    // Start scanning!
    // future.await;

    let db_duration = db_start_time.elapsed();
    info!("Inserted all documents: {:.2?}", db_duration);

    let tracks = db::get_all_tracks(&state.db.tracks).await.unwrap();

    Ok(tracks)
}

#[tauri::command]
pub async fn get_tracks(state: State<'_, AppState>) -> Result<Vec<Document<Track>>, String> {
    let tracks = db::get_all_tracks(&state.db.tracks).await;

    if tracks.is_err() {
        Err("Could not load any track".to_string())
    } else {
        Ok(tracks.unwrap())
    }
}
