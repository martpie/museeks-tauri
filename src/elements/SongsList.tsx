import { Component, createSignal, For, Show } from 'solid-js';
import { smartSelect } from '../lib/utils-list';
import { library } from '../stores/library';

import { Songs } from '../typings/museeks';
import styles from './SongsList.module.css';
import SongsListHeader from './SongsListHeader';

type Props = {
  songs: Songs;
  sortable?: boolean; // TODO: make that work for playlists
  showHeader?: boolean;
};

const SongsList: Component<Props> = (props) => {
  const [selected, setSelected] = createSignal<Set<string>>(new Set());

  return (
    <div class={styles.songsList}>
      {props.showHeader && (
        <SongsListHeader
          sortBy={library.sortBy}
          sortOrder={library.sortOrder}
          enableSort
        />
      )}
      <div class={styles.songs}>
        <Show when={props.songs.length === 0}>Nothing here yet!</Show>
        <For each={props.songs}>
          {(song) => (
            <div
              tabIndex={0}
              onPointerDown={async (e) => {
                // TODO: memo this?
                e.preventDefault();
                e.stopImmediatePropagation();

                const newSelected = await smartSelect(
                  props.songs,
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
              <div class={`${styles.cell} ${styles.cellSong}`}>
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
    </div>
  );
};

export default SongsList;
