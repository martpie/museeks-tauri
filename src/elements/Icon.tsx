import { Component, mergeProps } from 'solid-js';
// import 'material-icons/iconfont/filled.css';
import 'font-awesome/css/font-awesome.min.css';

import styles from './Icon.module.css';

type Props = {
  icon: string;
  label?: string;
  class?: string;
  // size?: 'normal'; // TODO: add more here
};

const Icon: Component<Props> = (props) => {
  return (
    <span
      class={`fa fa-fixed fa-${props.icon} ${props.class}`}
      aria-label={props.label}
    ></span>
  );
  // const props = mergeProps({ size: 'normal' }, initialProps);

  // return (
  //   <span
  //     classList={{
  //       [styles.materialIcons]: true,
  //       [styles.regular]: props.size === 'normal',
  //     }}
  //     aria-label={props.label}
  //   >
  //     {props.icon}
  //   </span>
  // );
};

export default Icon;
