import { createStore } from 'solid-js/store';

const [tracks, setTracks] = createStore<any[]>([]);

export { tracks, setTracks };
