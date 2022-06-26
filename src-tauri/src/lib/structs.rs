use bonsaidb::core::document::{CollectionDocument, Emit};
use bonsaidb::core::schema::view::CollectionViewSchema;
use bonsaidb::core::schema::{Collection, ReduceResult, View, ViewMapResult, ViewMappedValue};
use bonsaidb::local::AsyncDatabase;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::config::ConfigManager;

/**
 * TODO:
 *   - Export all needed structs to a single file: ts-rs#59
 */

/** ----------------------------------------------------------------------------
 * Databases
 * exposes databases for songs and playlists
 * -------------------------------------------------------------------------- */
#[derive(Debug)]
pub struct DB {
    pub songs: AsyncDatabase,
    pub playlists: AsyncDatabase,
}

/** ----------------------------------------------------------------------------
 * AppState
 * represent a struct that can be passed around carrying various helpers, like
 * states and DBs
 * -------------------------------------------------------------------------- */
#[derive(Debug)]
pub struct AppState {
    pub db: DB,
    pub config: ConfigManager,
}

/** ----------------------------------------------------------------------------
 * Song
 * represent a single song, id and path should be unique
 * -------------------------------------------------------------------------- */
#[derive(Debug, Clone, Serialize, Deserialize, Collection, TS)]
#[collection(name = "songs", views = [SongsByPath])]
#[ts(export, export_to = "../src/generated/typings/Song.ts")]
pub struct Song {
    pub title: String,
    pub album: String,
    pub artists: Vec<String>,
    pub genres: Vec<String>,
    pub year: Option<u32>,
    pub duration: f64,
    pub track: NumberOf,
    pub disk: NumberOf,
    pub path: String,
    pub metas: SongMetas,
}

#[derive(Debug, Clone, View)]
#[view(collection = Song, key = String, value = usize, name = "by-path")]
pub struct SongsByPath;

impl CollectionViewSchema for SongsByPath {
    type View = Self;

    fn map(&self, document: CollectionDocument<Song>) -> ViewMapResult<Self::View> {
        document
            .header
            .emit_key_and_value(document.contents.path, 1)
    }

    fn reduce(
        &self,
        mappings: &[ViewMappedValue<Self>],
        _rereduce: bool,
    ) -> ReduceResult<Self::View> {
        Ok(mappings.iter().map(|m| m.value).sum())
    }

    fn unique(&self) -> bool {
        return true;
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../src/generated/typings/NumberOf.ts")]
pub struct NumberOf {
    pub no: Option<u32>,
    pub of: Option<u32>,
}

// Used to store some data useful for search, sorting and filtering
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../src/generated/typings/SongMetas.ts")]
pub struct SongMetas {
    pub title: String,
    pub album: String,
    pub artists: Vec<String>,
    pub genres: String,
}

/** ----------------------------------------------------------------------------
 * Playlist
 * represent a playlist, that has a name and a list of songs
 * -------------------------------------------------------------------------- */

#[derive(Debug, Clone, Serialize, Deserialize, Collection, TS)]
#[collection(name = "playlists")]
#[ts(export, export_to = "../src/generated/typings/Playlist.ts")]
pub struct Playlist {
    pub name: String,
    pub songs: Vec<String>, // vector of IDs
    pub import_path: String,
}

/** ----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

// Struct helper useful to include the DB ID in addition to the actual fields
// of a document
#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../src/generated/typings/Document.ts")]
pub struct Document<T> {
    pub id: String,
    pub doc: T,
}
