import { Song, SortOrder, SortBy, Sort, Document } from '../typings/museeks';

// For perforances reasons, otherwise _.orderBy will perform weird check
// the is far more resource/time impactful
// We only get the first artist to avoid missing the order of songs in the
// same albums but with different artists
const parseArtist = (t: Document<Song>): string =>
  t.doc.metas.artists[0].toString();

// Declarations
const SORT_ORDERS: Record<SortBy, Record<SortOrder, Sort>> = {
  [SortBy.ARTIST]: {
    [SortOrder.ASC]: [
      // Default
      [parseArtist, 'year', 'metas.album', 'disk.no', 'track.no'],
      'asc',
    ],
    [SortOrder.DSC]: [
      [parseArtist, 'year', 'metas.album', 'disk.no', 'track.no'],
      ['desc'],
    ],
  },
  [SortBy.TITLE]: {
    [SortOrder.ASC]: [
      [
        'metas.title',
        parseArtist,
        'year',
        'metas.album',
        'disk.no',
        'track.no',
      ],
      'asc',
    ],
    [SortOrder.DSC]: [
      [
        'metas.title',
        parseArtist,
        'year',
        'metas.album',
        'disk.no',
        'track.no',
      ],
      ['desc'],
    ],
  },
  [SortBy.DURATION]: {
    [SortOrder.ASC]: [
      ['duration', parseArtist, 'year', 'metas.album', 'disk.no', 'track.no'],
      'asc',
    ],
    [SortOrder.DSC]: [
      ['duration', parseArtist, 'year', 'metas.album', 'disk.no', 'track.no'],
      ['desc'],
    ],
  },
  [SortBy.ALBUM]: {
    [SortOrder.ASC]: [
      ['metas.album', parseArtist, 'year', 'disk.no', 'track.no'],
      'asc',
    ],
    [SortOrder.DSC]: [
      ['metas.album', parseArtist, 'year', 'disk.no', 'track.no'],
      ['desc'],
    ],
  },
  [SortBy.GENRE]: {
    [SortOrder.ASC]: [
      [
        'metas.genres',
        parseArtist,
        'year',
        'metas.album',
        'disk.no',
        'track.no',
      ],
      'asc',
    ],
    [SortOrder.DSC]: [
      [
        'metas.genres',
        parseArtist,
        'year',
        'metas.album',
        'disk.no',
        'track.no',
      ],
      ['desc'],
    ],
  },
};

export default SORT_ORDERS;
