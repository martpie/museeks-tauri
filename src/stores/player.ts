import { Accessor, createMemo } from 'solid-js';
import { createStore, Store } from 'solid-js/store';
import SORT_ORDERS from '../lib/constants-order';
import { filterSongs, sortSongs } from '../lib/utils-library';
import {
  SortBy,
  SortOrder,
  Songs,
  Repeat,
  PlayerStatus,
} from '../typings/museeks';

type PlayerState = {
  queue: Songs;
  oldQueue: Songs;
  queueCursor: number | null;
  queueOrigin: null | string;
  repeat: Repeat;
  shuffle: boolean;
  playerStatus: PlayerStatus;
};

const initialState: PlayerState = {
  queue: [], // Tracks to be played
  oldQueue: [], // Queue backup (in case of shuffle)
  queueCursor: null, // The cursor of the queue
  queueOrigin: null, // URL of the queue when it was started
  repeat: Repeat.NONE, // TODO: config config.get('audioRepeat'), // the current repeat state (one, all, none)
  shuffle: false, // TODO: config config.get('audioShuffle'), // If shuffle mode is enabled
  playerStatus: PlayerStatus.STOP, // Player status
};

const [player, setPlayer] = createStore<Store<PlayerState>>(initialState);

export { player, setPlayer };
