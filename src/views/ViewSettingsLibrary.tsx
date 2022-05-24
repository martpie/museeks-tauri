import { Component } from 'solid-js';
import * as dialog from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { setLibrary } from '../stores/library';
import { Track } from '../generated/typings/Track';
import { Document } from '../generated/typings/Document';

const ViewSettingsLibrary: Component = () => {
  const onOpen = async () => {
    const selectedFolders = await dialog.open({
      directory: true,
      multiple: true,
    });

    let folders: Array<string> = [];

    if (selectedFolders === null) {
      // nah :]
    } else if (typeof selectedFolders === 'string') {
      folders = [selectedFolders];
    } else {
      folders = selectedFolders;
    }

    if (folders.length > 0) {
      const result: Array<Document<Track>> = await invoke('scan', {
        importPath: folders[0], // TODO: Handle multiple dir
      });

      if (Array.isArray(result)) {
        alert('import done');
        console.log(result);
        setLibrary({
          rawTracks: result,
        });
      } else {
        alert('something failed!');
      }
    }
  };

  return <button onClick={onOpen}>Open</button>;
};

export default ViewSettingsLibrary;
