import { Component, JSX } from 'solid-js';

import styles from './SidebarSection.module.css';

type Props = {
  label: string;
  children: JSX.Element;
};

const SidebarSection: Component<Props> = (props) => {
  return (
    <div class={styles.sidebarSection}>
      <h3 class={styles.heading}>{props.label}</h3>
      {props.children}
    </div>
  );
};

export default SidebarSection;
