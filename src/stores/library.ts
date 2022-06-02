import { Accessor, createMemo } from 'solid-js';
import { createStore, Store } from 'solid-js/store';
import SORT_ORDERS from '../lib/constants-order';
import { filterSongs, sortSongs } from '../lib/utils-library';
import { SortBy, SortOrder, Songs } from '../typings/museeks';

type LibraryState = {
  // All songs (returned by the DB)
  rawSongs: Songs;

  // View options and filters
  sortBy: SortBy;
  sortOrder: SortOrder;
  search: string;

  // Helper returning songs filtered and sorted
  songs: Songs;
};

const [library, setLibrary] = createStore<Store<LibraryState>>({
  rawSongs: [],

  sortBy: SortBy.ARTIST,
  sortOrder: SortOrder.ASC,
  search: '',

  get songs(): Songs {
    return memoizedSongs();
  },
});

/**
 * Memoized songs, to avoid re-computation every time a user selects a song
 * for example
 */
let memoizedSongs: Accessor<Songs> = createMemo(() => {
  const rawSongs = library.rawSongs;
  const sortBy = library.sortBy;
  const sortOrder = library.sortOrder;
  const search = library.search;

  const sort = SORT_ORDERS[sortBy][sortOrder];

  return sortSongs(filterSongs(rawSongs, search), sort);
});

export { library, setLibrary };
