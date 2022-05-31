/**
 * Various APIs useful to update and apply settings
 */

import { themes } from '../lib/themes';
import { Theme } from '../typings/museeks';

/**
 * Set the UI them by ID
 *
 * @param themeId The ID of the theme (defined within the theme itself)
 */
export const setTheme = (themeId: string): void => {
  const theme = themes.find((theme) => theme._id === themeId);

  if (theme !== undefined) {
    applyTheme(theme);
  }
};

/**
 * Apply theme colors to the current window
 */
export const applyTheme = async (theme: Theme): Promise<void> => {
  const root = document.documentElement;

  Object.entries(theme.variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

export const checkTheme = async (): Promise<void> => {
  // TODO: config on back-end side
  // const theme = await ipcRenderer.invoke(channels.THEME_GET);
  // applyThemeToUI(theme);
};
