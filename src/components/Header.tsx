import * as diacritics from 'diacritics';
import { Component } from 'solid-js';
import LibraryActions from '../actions/LibraryActions';
import { library } from '../stores/library';

import styles from './Header.module.css';
import PlayerControls from './PlayerControls';

const Header: Component = () => {
  return (
    <header class={styles.header} data-tauri-drag-region>
      <PlayerControls />
      {/* <img src={icons.PLAY} /> */}
      <input
        type='text'
        placeholder='Search'
        autocomplete='off'
        value={library.search}
        onInput={(e) => {
          LibraryActions.search(
            diacritics.remove(e.currentTarget.value.toLowerCase())
          );
        }}
      />
    </header>
  );
};

export default Header;
