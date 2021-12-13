import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Playlists from '../components/playlists/Playlists';

interface PlaylistTracksAPIResponse {
  href: string;
  items: Tracks[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

type Artist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

type Image = {
  height: number;
  url: string;
  width: number;
};

type Track = {
  album: {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
  };
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
};

type Tracks = {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: null;
  track: Track;
  video_thumbnail: {
    url: string;
  };
};

const Dashboard = () => {
  const { token, playlistid } = useParams();

  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<Tracks[]>();
  const [loadingMessage, setLoadingMessage] = useState('Loading');

  useEffect(() => {
    console.log('Running');
    setLoadingMessage('Loading tracks');
    setLoading(true);
    async function fetchTracks() {
      if (token && playlistid) {
        const tracks = await fetchPlaylistTrackIDs(token, playlistid);
        setTracks(tracks);
        try {
          const response = await fetch('http://localhost:5001/nltk/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              message: 'hello world',
            }),
          });
          console.log(response.status);
        } catch (error) {
          console.log('error');
          console.log(error);
        }
        setLoading(false);
      }
    }
    fetchTracks();
  }, [token]);

  return loading ? (
    <div>
      <p>{loadingMessage}...</p>
    </div>
  ) : (
    <div>
      <p>Loaded</p>
      <p>{tracks?.length}</p>
      <p>{tracks ? getTrackName(tracks[0].track) : 'Nada'}</p>
      <p>{tracks ? tracks[0].track.artists[0].name : 'Nada'}</p>
    </div>
  );
};

const getTrackName = (track: Track) => {
  return track.name;
};

const fetchPlaylistTrackIDs = async (
  token: string,
  playlistID: string
): Promise<Tracks[]> => {
  return new Promise<Tracks[]>(async (resolve, reject) => {
    const SPOTIFY_ENDPOINT: string = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
    try {
      const response = await fetch(SPOTIFY_ENDPOINT, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      if (response.ok) {
        const trackResponse =
          (await response.json()) as PlaylistTracksAPIResponse;
        const tracks = trackResponse.items;
        console.log(`Found ${tracks.length} tracks`);
        resolve(tracks);
      } else {
        reject(`Invalid response received from Spotify ${response.status}`);
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      reject('Unexpected error whilst fetching track information');
    }
  });
};

export default Dashboard;
