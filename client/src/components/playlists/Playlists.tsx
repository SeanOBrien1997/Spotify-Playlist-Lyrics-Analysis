import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
  const [loading, setLoading] = useState(true);
  const [playlistsResponse, setPlaylistsResponse] =
    useState<UserPlaylistsAPIResponse>();
  useEffect(() => {
    setLoading(true);
    async function fetchPlaylists() {
      const userPlaylists = await fetchUserPlaylists(token);
      setPlaylistsResponse(userPlaylists);
      setLoading(false);
    }
    fetchPlaylists();
  }, [token]);

  const [selectedPlaylist, setSelectedPlaylist] = useState<string>();
  const radioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlaylist(e.currentTarget.value);
  };
  const navigate = useNavigate();
  const formSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    selectedPlaylist
      ? navigate(`/user/${token}/dashboard/${selectedPlaylist}`)
      : alert('No playlist selected');
  };

  return loading ? (
    <div>
      <p>Loading playlists...</p>
    </div>
  ) : (
    <div>
      <h3>You have {playlistsResponse?.total} playlist(s):</h3>
      <div>
        <form onSubmit={formSubmit}>
          {playlistsResponse?.items.map(function (playlist, index) {
            return (
              <div>
                <dl>
                  <dt>
                    <img src={playlist.images[0].url} alt='Playlist art' className ='PlaylistImages' />
                    <p>Owner: {playlist.owner.display_name}</p>
                    <p>
                      <a
                        href={playlist.external_urls.spotify}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {playlist.name}
                      </a>
                    </p>
                    <p>Number of tracks: {playlist.tracks.total}</p>
                  </dt>
                </dl>
                <input
                  type='radio'
                  name='playlist'
                  id={playlist.id}
                  onChange={radioHandler}
                  value={playlist.id}
                />
              </div>
            );
          })}
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

const fetchUserPlaylists = async (
  token: string
): Promise<UserPlaylistsAPIResponse> => {
  return new Promise<UserPlaylistsAPIResponse>(async (resolve, reject) => {
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
        const userPlaylistsResponse =
          (await response.json()) as UserPlaylistsAPIResponse;
        resolve(userPlaylistsResponse);
      } else {
        console.error(JSON.stringify(response));
        reject(`Invalid response from Spotify ${response.status}`);
      }
    } catch (error) {
      reject(
        `Unexpected error whilst fetching user playlist information: ${JSON.stringify(
          error
        )}`
      );
    }
  });
};

export default Playlists;
