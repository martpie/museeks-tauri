import { Component } from 'solid-js';

import SongsListHeaderCell from './SongsListHeaderCell';
import { SortBy, SortOrder } from '../typings/museeks';

import styles from './SongsListHeader.module.css';
import songsListStyles from './SongsList.module.css';

type Props = {
  enableSort?: boolean;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

const SongsListHeader: Component<Props> = (props) => {
  return (
    <div class={styles.SongsListHeader}>
      <SongsListHeaderCell class={songsListStyles.cellSongPlaying} />
      <SongsListHeaderCell
        class={songsListStyles.cellSong}
        title='Title'
        sortBy={props.enableSort ? SortBy.TITLE : null}
        icon={getSortIcon(props.sortBy, props.sortOrder, SortBy.TITLE)}
      />
      <SongsListHeaderCell
        class={songsListStyles.cellDuration}
        title='Duration'
        sortBy={props.enableSort ? SortBy.DURATION : null}
        icon={getSortIcon(props.sortBy, props.sortOrder, SortBy.DURATION)}
      />
      <SongsListHeaderCell
        class={songsListStyles.cellArtist}
        title='Artist'
        sortBy={props.enableSort ? SortBy.ARTIST : null}
        icon={getSortIcon(props.sortBy, props.sortOrder, SortBy.ARTIST)}
      />
      <SongsListHeaderCell
        class={songsListStyles.cellAlbum}
        title='Album'
        sortBy={props.enableSort ? SortBy.ALBUM : null}
        icon={getSortIcon(props.sortBy, props.sortOrder, SortBy.ALBUM)}
      />
      <SongsListHeaderCell
        class={songsListStyles.cellGenre}
        title='Genre'
        sortBy={props.enableSort ? SortBy.GENRE : null}
        icon={getSortIcon(props.sortBy, props.sortOrder, SortBy.GENRE)}
      />
    </div>
  );
};

export default SongsListHeader;

/**
 * Helpers
 */

const getSortIcon = (sortBy: SortBy, sortOrder: SortOrder, column: SortBy) => {
  if (sortBy === column) {
    if (sortOrder === SortOrder.ASC) {
      return 'angle-up';
    }

    // Must be DSC then
    return 'angle-down';
  }

  return null;
};
