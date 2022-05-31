import { Many, ObjectIteratee } from 'lodash';
import { DeepReadonly } from 'solid-js/store';

/**
 * Re-export typings generated from Rust
 */
export type { Document } from '../generated/typings/Document';
export type { NumberOf } from '../generated/typings/NumberOf';
export type { Playlist } from '../generated/typings/Playlist';
export type { Song } from '../generated/typings/Song';
export type { SongMetas } from '../generated/typings/SongMetas';

import type { Document } from '../generated/typings/Document';
import type { Song } from '../generated/typings/Song';

export type Songs = DeepReadonly<Array<Document<Song>>>;

/**
 * Player related stuff
 */
export enum PlayerStatus {
  PLAY = 'play',
  PAUSE = 'pause',
  STOP = 'stop',
}

export enum Repeat {
  ALL = 'all',
  ONE = 'one',
  NONE = 'none',
}

export enum SortBy {
  ARTIST = 'artist',
  ALBUM = 'album',
  TITLE = 'title',
  DURATION = 'duration',
  GENRE = 'genre',
}

export enum SortOrder {
  ASC = 'asc',
  DSC = 'dsc',
}

export type Sort<T = any> = [
  sort: Many<ObjectIteratee<T>>,
  orders: Many<boolean | 'asc' | 'desc'>
];

/**
 * Themes
 */
// TODO: how to automate this? Maybe losen types to "string"
// type ThemeIds = 'dark' | 'light' | 'dark-legacy';

export interface Theme {
  // _id: ThemeIds;
  _id: string;
  name: string;
  // colorSchema: 'dark' | 'light' | 'normal'; // TODO normal = system?
  colorSchema: string;
  // themeSource: Electron.NativeTheme['themeSource'];
  variables: Record<string, string>;
}
