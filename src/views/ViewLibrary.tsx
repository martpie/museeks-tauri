import { Component, createSignal, For, Show } from 'solid-js';
import { smartSelect } from '../lib/utils-list';
// import { convertFileSrc } from '@tauri-apps/api/tauri';

import { library } from '../stores/library';
import styles from './ViewLibrary.module.css';

const ViewLibrary: Component = () => {
  const [selected, setSelected] = createSignal<Set<string>>(new Set());

  return (
    <div class={styles.songs}>
      <Show when={library.songs.length === 0}>Nothing here yet!</Show>
      <For each={library.songs}>
        {(song, index) => (
          <div
            tabIndex={0}
            onPointerDown={async (e) => {
              // TODO: memo this?
              e.preventDefault();
              e.stopImmediatePropagation();

              const newSelected = await smartSelect(
                library.songs,
                selected(),
                song.id,
                e
              );

              setSelected(() => newSelected);
            }}
            classList={{
              [styles.song]: true,
              [styles.songSelected]: selected().has(song.id),
            }}
          >
            <div class={`${styles.cell} ${styles.cellSongPlaying}`} />
            <div class={`${styles.cell} ${styles.cellArtist}`}>
              {song.doc.title}
            </div>
            <div class={`${styles.cell} ${styles.cellDuration}`}>
              {song.doc.duration}
            </div>
            <div class={`${styles.cell} ${styles.cellArtist}`}>
              {song.doc.artists.join(', ')}
            </div>
            <div class={`${styles.cell} ${styles.cellAlbum}`}>
              {song.doc.album}
            </div>
            <div class={`${styles.cell} ${styles.cellGenre}`}>
              {song.doc.genres.join(', ')}
            </div>
            {/* {song.doc.path} */}
            {/* <audio
              src={decodeURIComponent(convertFileSrc(song.doc.path))}
              controls
            /> */}
          </div>
        )}
      </For>
    </div>
  );
};

export default ViewLibrary;
