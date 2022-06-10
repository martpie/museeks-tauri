/**
 * List of Tauri commands related to library management
 */
use audiotags2::Tag;
use secular::lower_lay_string;
use tauri::State;

use crate::constants;
use crate::lib::db;
use crate::lib::fs_utils;
use crate::lib::structs::{AppState, Document, NumberOf, Song, SongMetas};
use crate::lib::time_logger::TimeLogger;

/**
 * Scan a folder and extract all ID3 tags from it
 *
 * TODO: Make it accept a Vector of String instead
 */
#[tauri::command]
pub async fn import(
    state: State<'_, AppState>,
    import_path: String,
) -> Result<Vec<Document<Song>>, String> {
    info!("Importing path {}", import_path);

    let paths = fs_utils::scan_dir(import_path, &constants::SUPPORTED_SONGS_EXTENSIONS);

    let task_count = paths.len();

    // Let's get all songs ID3
    info!("Importing ID3 tags from {} files", task_count);
    let scan_logger = TimeLogger::new("Scanned all id3 tags".into());

    let mut songs: Vec<Song> = vec![];

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

            let metas = SongMetas {
                title: lower_lay_string(title),
                album: lower_lay_string(album),
                artists: artists.iter().map(|s| lower_lay_string(&s)).collect(),
                genres: lower_lay_string(&genres.join(" ")),
            };

            let song = Song {
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

            songs.push(song);
        } else {
            warn!(
                "Failed to get ID3 tags: \"{}\". File {}",
                result.err().unwrap(),
                saved_path
            );
        }
    }

    info!("{} songs successfully scanned", songs.len());
    scan_logger.complete();

    let db_insert_logger = TimeLogger::new("Inserted songs".into());

    // Insert all songs in the DB
    let result = db::insert_song(&state.db.songs, songs).await;

    if result.is_err() {
        warn!("Something went wrong when inserting songs");
    } else {
        db_insert_logger.complete();
    }

    let songs = db::get_all_songs(&state.db.songs).await.unwrap();

    Ok(songs)
}

#[tauri::command]
pub async fn get_songs(state: State<'_, AppState>) -> Result<Vec<Document<Song>>, String> {
    let songs = db::get_all_songs(&state.db.songs).await;

    if songs.is_err() {
        Err("Could not load any song".to_string())
    } else {
        Ok(songs.unwrap())
    }
}
