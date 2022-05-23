import { Component, createSignal, For, Show } from 'solid-js';
import { convertFileSrc } from '@tauri-apps/api/tauri';

import { tracks } from '../stores/tracks';
import styles from './ViewLibrary.module.css';

const ViewLibrary: Component = () => {
  const [selected, setSelected] = createSignal<Set<Number>>(new Set());

  return (
    <div class={styles.tracks}>
      <Show when={tracks.length === 0}>Nothing here yet!</Show>
      <For each={tracks}>
        {(track, index) => (
          <div
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
            {track.id}
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
