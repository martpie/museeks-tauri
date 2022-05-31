import { Component } from 'solid-js';

import styles from './Separator.module.css';

/**
 * Main navigation, allowing users to switch between different views (library,
 * settings, etc)
 */
const Separator: Component = () => {
  return <hr class={styles.separator} />;
};

export default Separator;
