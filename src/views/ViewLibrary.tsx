import { Component, createSignal, For, Show } from 'solid-js';
// import { convertFileSrc } from '@tauri-apps/api/tauri';

import { library } from '../stores/library';
import styles from './ViewLibrary.module.css';

const ViewLibrary: Component = () => {
  const [selected, setSelected] = createSignal<Set<Number>>(new Set());

  return (
    <div class={styles.tracks}>
      <Show when={library.tracks.length === 0}>Nothing here yet!</Show>
      <For each={library.tracks}>
        {(track, index) => (
          <div
            tabIndex={0}
            onPointerDown={(e) => {
              e.preventDefault();
              if (selected().has(index())) {
                setSelected((prev) => {
                  return new Set([...prev].filter((x) => x !== index()));
                });
              } else {
                setSelected((prev) => new Set(prev).add(index()));
              }
            }}
            classList={{
              [styles.track]: true,
              [styles.track_selected]: selected().has(index()),
            }}
          >
            {track.doc.title}
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
