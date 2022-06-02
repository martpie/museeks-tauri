import { library, setLibrary } from '../stores/library';
import { Songs, SortBy, SortOrder } from '../typings/museeks';

const setSongs = (songs: Songs): void => {
  setLibrary({ rawSongs: songs });
};

const search = (search: string): void => {
  setLibrary({ search });
};

const sort = (sortBy: SortBy): void => {
  // If the user request to change asc/dsc
  if (sortBy === library.sortBy) {
    setLibrary({
      sortOrder:
        library.sortOrder === SortOrder.ASC ? SortOrder.DSC : SortOrder.ASC,
    });
    return;
  }

  // Otherwise, just change the sorted column
  setLibrary({ sortBy, sortOrder: SortOrder.ASC });
};

const LibraryActions = {
  setSongs,
  search,
  sort,
};

export default LibraryActions;
