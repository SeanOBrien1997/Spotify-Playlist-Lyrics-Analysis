import React, { useEffect } from 'react';

interface PlaylistProps {
  token: string;
}

interface UserPlaylistsAPIResponse {
  href: string;
  items: Playlist[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

type Image = {
  height: number;
  url: string;
  width: number;
};

const Playlists = (props: PlaylistProps) => {
  const { token } = props;
  useEffect(() => {
    async function fetchPlaylists() {
      const userPlaylists = await fetchUserPlaylists(token);
    }
    fetchPlaylists();
  }, [token]);
  return (
    <div>
      <p>Playlists</p>
    </div>
  );
};

const fetchUserPlaylists = async (token: string) => {
  const SPOTIFY_ENDPOINT: string = 'https://api.spotify.com/v1/me/playlists';
  try {
    const response = await fetch(SPOTIFY_ENDPOINT, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    if (response.ok) {
      const playlists = ((await response.json()) as UserPlaylistsAPIResponse)
        .items;
      playlists.forEach((playlist) => {
        console.log(playlist.name);
      });
    } else {
      console.error(JSON.stringify(response));
    }
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};

export default Playlists;
