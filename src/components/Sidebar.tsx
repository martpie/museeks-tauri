import { NavLink } from 'solid-app-router';
import { Component } from 'solid-js';

import styles from './Sidebar.module.css';

/**
 * Main navigation, allowing users to switch between different views (library,
 * settings, etc)
 */
const Sidebar: Component = () => {
  return (
    <aside class={styles.sidebar}>
      <NavLink href='/'>Tracks</NavLink>
      <NavLink href='/playlists/1'>Playlist 1</NavLink>
      <NavLink href='/playlists/2'>Playlist 2</NavLink>
      <NavLink href='/settings' class={styles.bottom}>
        to settings
      </NavLink>
    </aside>
  );
};

export default Sidebar;
