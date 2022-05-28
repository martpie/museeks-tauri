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

  get songs(): typeof this.rawSongs {
    const rawSongs = this.rawSongs;
    const sortBy = this.sortBy;
    const sortOrder = this.sortOrder;
    const search = this.search;

    return sortSongs(
      filterSongs(rawSongs, search),
      SORT_ORDERS[sortBy][sortOrder]
    );
  },
});

export { library, setLibrary };
