import { NavLink } from 'solid-app-router';
import { Component, JSX } from 'solid-js';

import styles from './SidebarItem.module.css';

type Props = {
  children: JSX.Element;
  href: string;
};

const SidebarItem: Component<Props> = (props) => {
  return (
    <NavLink
      href={props.href}
      class={styles.sidebarItem}
      activeClass={styles.active}
    >
      {props.children}
    </NavLink>
  );
};

export default SidebarItem;
