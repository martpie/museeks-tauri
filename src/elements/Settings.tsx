import { Component, JSX } from 'solid-js';
import styles from './Settings.module.css';

type Props = {
  children: JSX.Element;
};

export const Section: Component<Props> = (props) => (
  <section class={styles.settingSection}>{props.children}</section>
);

export const Description: Component<Props> = (props) => (
  <p class={styles.settingDescription}>{props.children}</p>
);

export const Label: Component<JSX.IntrinsicElements['label']> = (props) => {
  const { children, ...restProps } = props;

  return (
    <label class={styles.settingLabel} {...restProps}>
      {props.children}
    </label>
  );
};

export const Title: Component<Props> = (props) => (
  <span class={styles.settingTitle}>{props.children}</span>
);

export const Input: Component<JSX.IntrinsicElements['input']> = (props) => {
  const { children, ...restProps } = props;

  return (
    <input class={styles.settingInput} {...restProps}>
      {props.children}
    </input>
  );
};

export const Error: Component<Props> = (props) => (
  <p class={styles.settingError}>{props.children}</p>
);

export const Select: Component<JSX.IntrinsicElements['select']> = (props) => (
  <select class={styles.settingSelect} {...props}>
    {props.children}
  </select>
);
