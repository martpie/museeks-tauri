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
      [
        parseArtist,
        'doc.year',
        'doc.metas.album',
        'doc.disk.no',
        'doc.track.no',
      ],
      'asc',
    ],
    [SortOrder.DSC]: [
      [
        parseArtist,
        'doc.year',
        'doc.metas.album',
        'doc.disk.no',
        'doc.track.no',
      ],
      ['desc'],
    ],
  },
  [SortBy.TITLE]: {
    [SortOrder.ASC]: [
      [
        'doc.metas.title',
        parseArtist,
        'doc.year',
        'doc.metas.album',
        'doc.disk.no',
        'doc.track.no',
      ],
      'asc',
    ],
    [SortOrder.DSC]: [
      [
        'doc.metas.title',
        parseArtist,
        'doc.year',
        'doc.metas.album',
        'doc.disk.no',
        'doc.track.no',
      ],
      ['desc'],
    ],
  },
  [SortBy.DURATION]: {
    [SortOrder.ASC]: [
      [
        'doc.duration',
        parseArtist,
        'doc.year',
        'doc.metas.album',
        'doc.disk.no',
        'doc.track.no',
      ],
      'asc',
    ],
    [SortOrder.DSC]: [
      [
        'doc.duration',
        parseArtist,
        'doc.year',
        'doc.metas.album',
        'doc.disk.no',
        'doc.track.no',
      ],
      ['desc'],
    ],
  },
  [SortBy.ALBUM]: {
    [SortOrder.ASC]: [
      [
        'doc.metas.album',
        parseArtist,
        'doc.year',
        'doc.disk.no',
        'doc.track.no',
      ],
      'asc',
    ],
    [SortOrder.DSC]: [
      [
        'doc.metas.album',
        parseArtist,
        'doc.year',
        'doc.disk.no',
        'doc.track.no',
      ],
      ['desc'],
    ],
  },
  [SortBy.GENRE]: {
    [SortOrder.ASC]: [
      [
        'doc.metas.genres',
        parseArtist,
        'doc.year',
        'doc.metas.album',
        'doc.disk.no',
        'doc.track.no',
      ],
      'asc',
    ],
    [SortOrder.DSC]: [
      [
        'doc.metas.genres',
        parseArtist,
        'doc.year',
        'doc.metas.album',
        'doc.disk.no',
        'doc.track.no',
      ],
      ['desc'],
    ],
  },
};

export default SORT_ORDERS;
