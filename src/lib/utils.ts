import { os } from '@tauri-apps/api';

/**
 * Parse an int to a more readable string
 */
export const parseDuration = (duration: number | null): string => {
  if (duration !== null) {
    const hours = Math.trunc(duration / 3600);
    const minutes = Math.trunc(duration / 60) % 60;
    const seconds = Math.trunc(duration) % 60;

    const hoursStringified = hours < 10 ? `0${hours}` : hours;
    const minutesStringified = minutes < 10 ? `0${minutes}` : minutes;
    const secondsStringified = seconds < 10 ? `0${seconds}` : seconds;

    let result = hoursStringified > 0 ? `${hoursStringified}:` : '';
    result += `${minutesStringified}:${secondsStringified}`;

    return result;
  }

  return '00:00';
};

/**
 * Sort an array of string by ASC or DESC, then remove all duplicates
 */
export const simpleSort = (
  array: string[],
  sorting: 'asc' | 'desc'
): string[] => {
  if (sorting === 'asc') {
    array.sort((a, b) => (a > b ? 1 : -1));
  } else if (sorting === 'desc') {
    array.sort((a, b) => (b > a ? -1 : 1));
  }

  const result: string[] = [];
  array.forEach((item) => {
    if (!result.includes(item)) result.push(item);
  });

  return result;
};

/**
 * Remove duplicates (realpath) and useless children folders
 */
export const removeUselessFolders = (folders: string[]): string[] => {
  // Remove duplicates
  let filteredFolders = folders.filter(
    (elem, index) => folders.indexOf(elem) === index
  );

  const foldersToBeRemoved: string[] = [];

  filteredFolders.forEach((folder, i) => {
    filteredFolders.forEach((subfolder, j) => {
      if (
        subfolder.includes(folder) &&
        i !== j &&
        !foldersToBeRemoved.includes(folder)
      ) {
        foldersToBeRemoved.push(subfolder);
      }
    });
  });

  filteredFolders = filteredFolders.filter(
    (elem) => !foldersToBeRemoved.includes(elem)
  );

  return filteredFolders;
};
