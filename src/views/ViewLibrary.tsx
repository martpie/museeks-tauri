import { Component, createEffect, createMemo, useContext } from 'solid-js';
import SongsList from '../elements/SongsList';
import { library } from '../stores/library';

import _styles from './ViewLibrary.module.css';

const ViewLibrary: Component = () => {
  return <SongsList songs={library.songs} showHeader />;
};

export default ViewLibrary;
