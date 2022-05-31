/* @refresh reload */
import { render } from 'solid-js/web';

import './styles/global.css';
import App from './App';
import { os } from '@tauri-apps/api';
import { setAppStore } from './stores/app';

const platform = await os.platform();

setAppStore({ platform });

render(() => <App />, document.getElementById('root') as HTMLElement);
