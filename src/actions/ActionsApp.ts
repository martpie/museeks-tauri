import { invoke } from '@tauri-apps/api';
import { themes } from '../lib/themes';
import { setLibrary } from '../stores/library';
import { applyTheme, setTheme } from './ActionsSettings';

/**
 * Super actions called on app initialization, make various checks and apply
 * settings.
 */
export const init = async (): Promise<void> => {
  invoke('show_main_window');
  let songs: any[] = await invoke('get_songs');

  setLibrary({
    rawSongs: songs,
  });

  // TODO: should be dynamic come from config
  // Apply theme here
  setTheme('light');
};
