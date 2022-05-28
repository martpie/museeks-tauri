import { Component } from 'solid-js';

import styles from './Header.module.css';

const Header: Component = () => {
  return (
    <header class={styles.header} data-tauri-drag-region>
      This is the header :D (controls, search, etc) (drag me to reposition me)
    </header>
  );
};

export default Header;
