import { Component } from 'solid-js';

import styles from './SongsListHeaderCell.module.css';
import { SortBy } from '../typings/museeks';
import Icon from './Icon';
import LibraryActions from '../actions/LibraryActions';

interface Props {
  title?: string;
  class?: string;
  sortBy?: SortBy | null;
  icon?: string | null;
}

const SongsListHeaderCell: Component<Props> = (props) => {
  const { sortBy } = props;

  const content = (
    <>
      <div class={styles.name}>{props.title || <>&nbsp</>}</div>
      {props.icon && (
        <div class={styles.icon}>
          <Icon icon={props.icon} />
        </div>
      )}
    </>
  );

  if (sortBy != null) {
    return (
      <button
        class={props.class}
        classList={{
          [styles.trackCellHeader]: true,
          [styles.sort]: props.sortBy != null,
        }}
        onClick={() => {
          LibraryActions.sort(sortBy);
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      class={props.class}
      classList={{
        // TODO: check if reactive
        [styles.trackCellHeader]: true,
        [styles.sort]: props.sortBy != null,
      }}
    >
      {content}
    </div>
  );
};

export default SongsListHeaderCell;
