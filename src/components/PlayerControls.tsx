import { Component } from 'solid-js';

import styles from './PlayerControls.module.css';
import Icon from '../elements/Icon';

/**
 * Main players actions, located in the header (play, pause, backward,
 * forward, etc)
 */
const PlayerControls: Component = () => {
  return (
    <>
      <button aria-label='play'>
        <Icon icon='backward' label='Settings' />
      </button>
      <button aria-label='play'>
        <Icon icon='play' label='Settings' />
      </button>
      <button aria-label='play'>
        <Icon icon='forward' label='Settings' />
      </button>
    </>
  );
};

export default PlayerControls;
