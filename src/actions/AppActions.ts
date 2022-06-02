import { invoke } from '@tauri-apps/api';
import { produce } from 'solid-js/store';
import { Songs } from '../typings/museeks';
import SettingsActions from './SettingsActions';

/**
 * Super actions called on app initialization, make various checks and apply
 * settings.
 */
const init = async (): Promise<void> => {
  invoke('show_main_window');
  // TODO: should be dynamic come from config
  // Apply theme here
  SettingsActions.setTheme('light');
};

const AppActions = {
  init,
};

export default AppActions;
