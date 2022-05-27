/**
 * List of Tauri commands related to library management
 */
use audiotags2::Tag;
use diacritics::remove_diacritics;
use std::time::Instant;
use tauri::State;

use crate::constants;
use crate::lib::db;
use crate::lib::fs_utils;
use crate::lib::structs::{AppState, Document, NumberOf, Track, TrackMetas};

/**
 * Scan a folder and extract all ID3 tags from it
 *
 * TODO: Make it accept a Vector of String instead
 */
#[tauri::command]
pub async fn import(
    state: State<'_, AppState>,
    import_path: String,
) -> Result<Vec<Document<Track>>, String> {
    info!("Importing path {}", import_path);

    let paths = fs_utils::scan_dir(import_path, &constants::SUPPORTED_TRACKS_EXTENSIONS);

    let task_count = paths.len();

    // Let's get all tracks ID3
    info!("Importing ID3 tags from {} files", task_count);
    let id3_start_time = Instant::now();

    let mut tracks: Vec<Track> = vec![];

    for path in paths {
        let result = Tag::new().read_from_path(&path);
        let saved_path = path.to_string(); // Why do I need to copy this?

        if result.is_ok() {
            let tag = result.unwrap();

            let title = tag.title().unwrap_or("Unknown");
            let album = tag.album_title().unwrap_or("Unknown");
            let artists = tag.artists().unwrap_or(vec![] as Vec<&str>);
            // TODO: https://github.com/martpie/rust-audiotags2/issues/7
            let genres = vec![(tag.genre().unwrap_or(""))];

            let metas = TrackMetas {
                title: remove_diacritics(title).to_ascii_lowercase(),
                album: remove_diacritics(album).to_ascii_lowercase(),
                artists: artists
                    .iter()
                    .map(|s| remove_diacritics(&s.to_ascii_lowercase()))
                    .collect(),
                genres: remove_diacritics(&genres.join(" ")).to_ascii_lowercase(),
            };

            let track = Track {
                title: title.to_string(),
                album: album.to_string(),
                artists: artists.iter().map(|&s| s.into()).collect(),
                genres: genres.iter().map(|&s| s.into()).collect(),
                year: tag.year(),
                // TODO: do not read the duration tag, compute it instead
                duration: tag.duration().unwrap_or(0.0),
                track: NumberOf {
                    no: tag.track_number(),
                    of: tag.total_tracks(),
                },
                disk: NumberOf {
                    no: tag.disc_number(),
                    of: tag.total_discs(),
                },
                path,
                metas,
            };

            tracks.push(track);
        } else {
            warn!(
                "Failed to get ID3 tags: \"{}\". File {}",
                result.err().unwrap(),
                saved_path
            );
        }
    }
    let id3_duration = id3_start_time.elapsed();
    info!("{} tracks successfully scanned", tracks.len());
    info!("Scanned all id3 tags: {:.2?}", id3_duration);

    let db_start_time = Instant::now();

    // Insert all tracks in the DB
    let result = db::insert_track(&state.db.tracks, tracks).await;

    if result.is_err() {
        warn!("Something went wrong when inserting tracks");
    } else {
        let db_duration = db_start_time.elapsed();
        info!("Succesfully inserted documents: {:.2?}", db_duration);
    }

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
