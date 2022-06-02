import orderBy from 'lodash-es/orderBy';
import { Sort, Songs } from '../typings/museeks';

/**
 * Filter an array of songs by string
 */
export const filterSongs = (songs: Songs, search: string): Songs => {
  // Avoid performing useless searches
  if (search.length === 0) return songs;

  return songs.filter(
    (song) =>
      song.doc.metas.artists.includes(search) ||
      song.doc.metas.album.includes(search) ||
      song.doc.metas.genres.includes(search) ||
      song.doc.metas.title.includes(search)
  );
};

/**
 * Sort an array of songs (alias to lodash.orderby)
 */
export const sortSongs = (songs: Songs, sort: Sort): Songs => {
  return orderBy(songs, ...sort);
};
