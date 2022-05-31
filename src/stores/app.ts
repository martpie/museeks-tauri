import { os } from '@tauri-apps/api';
import { createStore, Store } from 'solid-js/store';

type LibraryState = {
  platform: null | Awaited<ReturnType<typeof os.platform>>;
};

/**
 * Store used to store some non-mutable data from the back-end side
 */
const [appStore, setAppStore] = createStore<Store<LibraryState>>({
  platform: null,
});

export { appStore, setAppStore };
