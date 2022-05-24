use std::time::Instant;

use super::structs::{Document, Playlist, Track, DB};
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
    let storage_configuration = StorageConfiguration::new("main.bonsaidb")
        .with_schema::<Track>()?
        .with_schema::<Playlist>()?;

    let storage = AsyncStorage::open(storage_configuration).await?;

    let db_tracks = storage.create_database::<Track>("tracks", true).await?;
    let db_playlists = storage
        .create_database::<Playlist>("playlists", true)
        .await?;

    Ok(DB {
        tracks: db_tracks,
        playlists: db_playlists,
    })
}

/**
 * Insert a new track in the DB, will fail in case there is a duplicate unique
 * key (like track.path)
 *
 * Doc: https://github.com/khonsulabs/bonsaidb/blob/main/examples/basic-local/examples/basic-local-multidb.rs
 */
pub async fn insert_track<C: AsyncConnection>(
    connection: &C,
    tracks: Vec<Track>,
) -> Result<(), bonsaidb::core::Error> {
    // BonsaiDB does not work well (as of today) with a lot of very small
    // insertions, so let's insert tracks by batch instead then
    let batches: Vec<Vec<Track>> = tracks.chunks(INSERTION_BATCH).map(|x| x.to_vec()).collect();

    info!("Splitting tracks in {} batches", batches.len());

    for (index, batch) in batches.iter().enumerate() {
        info!("Trying to insert batch {}", index);

        let mut tx = Transaction::new();

        for track in batch {
            tx.push(Operation::push_serialized::<Track>(&track)?);
        }

        // Let's goooo
        tx.apply_async(connection).await?;
    }

    Ok(())
}

pub async fn get_all_tracks<C: AsyncConnection>(
    connection: &C,
) -> Result<Vec<Document<Track>>, bonsaidb::core::Error> {
    let start_time = Instant::now();

    let collection = connection.collection::<Track>();
    let docs = collection.all().await?;

    let mut tracks = vec![];

    for doc in docs {
        let deserialized = Track::document_contents(&doc)?;
        let parsed_document = Document {
            id: doc.header.id.to_string(),
            doc: deserialized,
        };

        tracks.push(parsed_document);
    }

    let duration = start_time.elapsed();
    info!("Got all tracks in {:.2?}", duration);

    Ok(tracks)
}
