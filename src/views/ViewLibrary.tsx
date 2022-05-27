import { Component, createSignal, For, Show } from 'solid-js';
// import { convertFileSrc } from '@tauri-apps/api/tauri';

import { library } from '../stores/library';
import styles from './ViewLibrary.module.css';

const ViewLibrary: Component = () => {
  const [selected, setSelected] = createSignal<Set<string>>(new Set());

  return (
    <div class={styles.tracks}>
      <Show when={library.tracks.length === 0}>Nothing here yet!</Show>
      <For each={library.tracks}>
        {(track, index) => (
          <div
            tabIndex={0}
            onPointerDown={(e) => {
              // TODO: events modifiers (cmd, shift, etc)
              e.preventDefault();

              setSelected(() => {
                return new Set([track.id]);
              });
              // if (selected().has(index())) {
              //   setSelected((prev) => {
              //     return new Set([...prev].filter((x) => x !== index()));
              //   });
              // } else {
              //   setSelected((prev) => new Set(prev).add(index()));
              // }
            }}
            classList={{
              [styles.track]: true,
              [styles.trackSelected]: selected().has(track.id),
            }}
          >
            <div class={`${styles.cell} ${styles.cellTrackPlaying}`} />
            <div class={`${styles.cell} ${styles.cellArtist}`}>
              {track.doc.title}
            </div>
            <div class={`${styles.cell} ${styles.cellDuration}`}>
              {track.doc.duration}
            </div>
            <div class={`${styles.cell} ${styles.cellArtist}`}>
              {track.doc.artists.join(', ')}
            </div>
            <div class={`${styles.cell} ${styles.cellAlbum}`}>
              {track.doc.album}
            </div>
            <div class={`${styles.cell} ${styles.cellGenre}`}>
              {track.doc.genres.join(', ')}
            </div>
            {/* {track.doc.path} */}
            {/* <audio
              src={decodeURIComponent(convertFileSrc(track.doc.path))}
              controls
            /> */}
          </div>
        )}
      </For>
    </div>
  );
};

export default ViewLibrary;
