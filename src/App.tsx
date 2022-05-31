import { Component, ErrorBoundary, onMount } from 'solid-js';
import {
  hashIntegration,
  Navigate,
  Route,
  Router,
  Routes,
} from 'solid-app-router';
import { invoke } from '@tauri-apps/api/tauri';

import ViewLibrary from './views/ViewLibrary';
import ViewSettingsLibrary from './views/ViewSettingsLibrary';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import styles from './App.module.css';
import ViewPlaylist from './views/ViewPlaylist';
import * as AppActions from './actions/ActionsApp';

const App: Component = () => {
  // Once the app has loaded, let's show the window
  onMount(async () => {
    AppActions.init();
  });

  return (
    <ErrorBoundary
      fallback={(err) => (
        <div>
          Something went wrong: {err.toString()}
          <br />
          {err.stack}
        </div>
      )}
    >
      <Router source={hashIntegration()}>
        <Header />
        <Sidebar />
        <main class={styles.view}>
          <Routes>
            <Route path='/' element={<ViewLibrary />} />
            <Route path='/settings'>
              <Route path='/' element={<Navigate href={() => 'library'} />} />
              <Route path='/library' element={<ViewSettingsLibrary />} />
              <Route
                path='/interface'
                element={<div>interface settings</div>}
              />
              <Route path='/audio' element={<div>audio settings</div>} />
              <Route path='/about' element={<div>about settings</div>} />
            </Route>
            <Route path='/playlists'>
              <Route path='/:playlistId' element={<ViewPlaylist />} />
            </Route>
          </Routes>
        </main>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
