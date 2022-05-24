import { createStore } from 'solid-js/store';
import { Document } from '../generated/typings/Document';
import { Track } from '../generated/typings/Track';

type LibraryState = {
  rawTracks: Array<Document<Track>>;
  tracks: Array<Document<Track>>;
};

const [library, setLibrary] = createStore<LibraryState>({
  rawTracks: [],

  // Helper returning tracks filtered and sorted
  get tracks() {
    // TODO: sorting/filtering
    return this.rawTracks;
  },
});

export { library, setLibrary };
