import * as diacritics from 'diacritics';
import { Component } from 'solid-js';
import { library, setLibrary } from '../stores/library';

import styles from './Header.module.css';

const Header: Component = () => {
  return (
    <header class={styles.header} data-tauri-drag-region>
      This is the header :D (controls, search, etc) (drag me to reposition me)
      <input
        type='test'
        placeholder='Search'
        autocomplete='off'
        value={library.search}
        onInput={(e) => {
          setLibrary({
            search: diacritics.remove(e.currentTarget.value.toLowerCase()),
          });
        }}
      />
    </header>
  );
};

export default Header;
