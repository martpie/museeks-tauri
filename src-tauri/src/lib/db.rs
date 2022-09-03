use crate::lib::time_logger::TimeLogger;

use super::dirs;
use super::structs::{Document, Playlist, Song, DB};
use bonsaidb::core::connection::{AsyncConnection, AsyncStorageConnection};
use bonsaidb::core::schema::SerializedCollection;
use bonsaidb::core::transaction::{Operation, Transaction};
use bonsaidb::local::config::{Builder, StorageConfiguration};
use bonsaidb::local::AsyncStorage;

const INSERTION_BATCH: usize = 100;

/**
 * Doc: https://github.com/khonsulabs/bonsaidb/blob/main/examples/basic-local/examples/basic-local-multidb.rs
 */
pub async fn init() -> Result<DB, bonsaidb::core::Error> {
    let storage_configuration =
        StorageConfiguration::new(dirs::museeks_config_dir().join("main.bonsaidb"))
            .with_schema::<Song>()?
            .with_schema::<Playlist>()?;

    let storage = AsyncStorage::open(storage_configuration).await?;

    let db_songs = storage.create_database::<Song>("songs", true).await?;
    let db_playlists = storage
        .create_database::<Playlist>("playlists", true)
        .await?;

    Ok(DB {
        songs: db_songs,
        playlists: db_playlists,
    })
}

/**
 * Insert a new song in the DB, will fail in case there is a duplicate unique
 * key (like song.path)
 *
 * Doc: https://github.com/khonsulabs/bonsaidb/blob/main/examples/basic-local/examples/basic-local-multidb.rs
 */
pub async fn insert_song<C: AsyncConnection>(
    connection: &C,
    songs: Vec<Song>,
) -> Result<(), bonsaidb::core::Error> {
    // BonsaiDB does not work well (as of today) with a lot of very small
    // insertions, so let's insert songs by batch instead then
    let batches: Vec<Vec<Song>> = songs.chunks(INSERTION_BATCH).map(|x| x.to_vec()).collect();

    info!("Splitting songs in {} batches", batches.len());

    for batch in batches {
        let mut tx = Transaction::new();

        for song in batch {
            tx.push(Operation::push_serialized::<Song>(&song)?);
        }

        // Let's goooo
        tx.apply_async(connection).await?;
    }

    Ok(())
}

pub async fn get_all_songs<C: AsyncConnection>(
    connection: &C,
) -> Result<Vec<Document<Song>>, bonsaidb::core::Error> {
    let timer = TimeLogger::new("Got all songs".into());

    let collection = connection.collection::<Song>();
    let docs = collection.all().await?;

    let mut songs = vec![];

    for doc in docs {
        let deserialized = Song::document_contents(&doc)?;
        let parsed_document = Document {
            id: doc.header.id.to_string(),
            doc: deserialized,
        };

        songs.push(parsed_document);
    }

    timer.complete();

    Ok(songs)
}
