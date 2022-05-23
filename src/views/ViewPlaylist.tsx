import { useParams } from 'solid-app-router';
import { Component } from 'solid-js';

const ViewPlaylist: Component = () => {
  const params = useParams();

  return <div>playlist: {params.playlistId}</div>;
};

export default ViewPlaylist;
