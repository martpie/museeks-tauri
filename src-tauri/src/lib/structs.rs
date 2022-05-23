use bonsaidb::core::document::{CollectionDocument, Emit};
use bonsaidb::core::schema::view::CollectionViewSchema;
use bonsaidb::core::schema::{Collection, ReduceResult, View, ViewMapResult, ViewMappedValue};
use bonsaidb::local::AsyncDatabase;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

/**
 * TODO:
 *   - Export all needed structs to a single file: ts-rs#59
 */

/** ----------------------------------------------------------------------------
 * Databases
 * exposes databases for tracks and playlists
 * -------------------------------------------------------------------------- */
#[derive(Debug)]
pub struct DB {
    pub tracks: AsyncDatabase,
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
}

/** ----------------------------------------------------------------------------
 * Track
 * represent a single song, id and path should be unique
 * -------------------------------------------------------------------------- */
#[derive(Debug, Serialize, Deserialize, Collection, TS)]
#[collection(name = "tracks", views = [TracksByPath])]
// #[ts(export)]
pub struct Track {
    pub title: String,
    pub album: String,
    pub artists: Vec<String>,
    pub genre: Vec<String>,
    pub year: Option<i32>,
    pub duration: u32,
    pub track: NumberOf,
    pub disk: NumberOf,
    pub path: String,
}

#[derive(Debug, Clone, View)]
#[view(collection = Track, key = String, value = usize, name = "by-path")]
pub struct TracksByPath;

impl CollectionViewSchema for TracksByPath {
    type View = Self;

    fn map(&self, document: CollectionDocument<Track>) -> ViewMapResult<Self::View> {
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

#[derive(Debug, Serialize, Deserialize, TS)]
// #[ts(export)]
pub struct NumberOf {
    pub no: Option<i16>,
    pub of: Option<i16>,
}

/** ----------------------------------------------------------------------------
 * Playlist
 * represent a playlist, that has a name and a list of tracks
 * -------------------------------------------------------------------------- */

#[derive(Debug, Serialize, Deserialize, Collection, TS)]
#[collection(name = "playlists")]
// #[ts(export)]
pub struct Playlist {
    pub name: String,
    pub tracks: Vec<i32>, // vector of IDs
    pub import_path: String,
}

/** ----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

// Struct helper useful to include the DB ID in addition to the actual fields
// of a document
#[derive(Debug, Serialize, Deserialize, TS)]
// #[ts(export)]
pub struct Document<T> {
    pub id: String,
    pub doc: T,
}
