import { os } from '@tauri-apps/api';

export const isLeftClick = (e: MouseEvent): boolean => e.button === 0;
export const isRightClick = (e: MouseEvent): boolean => e.button === 2;

/**
 * Returns true if
 * - the CTRL key is pressed on non-macOS
 * - the CMD key is pressed on macOS
 */
export const isCtrlKey = async (
  e: KeyboardEvent | MouseEvent
): Promise<boolean> => {
  const isMacOS = (await os.platform()) === 'darwin';

  return (isMacOS && e.metaKey) || (!isMacOS && e.ctrlKey);
};

/**
 * Returns true if
 * - the ALT key is pressed on non-macOS
 * - the CTRL key is pressed on macOS
 */
export const isAltKey = async (
  e: KeyboardEvent | MouseEvent
): Promise<boolean> => {
  const isMacOS = (await os.platform()) === 'darwin';

  return (isMacOS && e.ctrlKey) || (!isMacOS && e.metaKey);
};
