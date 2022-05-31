import { Component } from 'solid-js';

import SidebarSection from '../elements/SidebarSection';
import SidebarItem from '../elements/SidebarItem';

import styles from './Sidebar.module.css';

/**
 * Main navigation, allowing users to switch between different views (library,
 * settings, etc)
 */
const Sidebar: Component = () => {
  return (
    <aside class={styles.sidebar}>
      <SidebarSection label='Library'>
        <SidebarItem href='/library'>Songs</SidebarItem>
      </SidebarSection>

      <SidebarSection label='Playlists'>
        <SidebarItem href='/playlists/1'>Chill</SidebarItem>
        <SidebarItem href='/playlists/2'>Partyyyy</SidebarItem>
      </SidebarSection>

      <div class={styles.bottom}>
        <SidebarItem href='/settings'>Settings</SidebarItem>
      </div>
    </aside>
  );
};

export default Sidebar;
