/**
 * Scopes defined by the Spotify API that inform the user what information is being shared during login.
 * @see https://developer.spotify.com/documentation/general/guides/authorization/scopes/
 */
export const Scopes = {
  Images: {
    'ugc-image-upload': 'ugc-image-upload',
  },
  'Spotify-Connect': {
    'user-read-playback-state': 'user-read-playback-state',
    'user-modify-playback-state': 'user-modify-playback-state',
    'user-read-currently-playing': 'user-read-currently-playing',
  },
  Users: {
    'user-read-private': 'user-read-private',
    'user-read-email': 'user-read-email',
  },
  Follow: {
    'user-follow-modify': 'user-follow-modify',
    'user-follow-read': 'user-follow-read',
  },
  Library: {
    'user-library-modify': 'user-library-modify',
    'user-library-read': 'user-library-read',
  },
  Playback: {
    streaming: 'streaming',
    'app-remote-control': 'app-remote-control',
  },
  'Listening-History': {
    'user-read-playback-position': 'user-read-playback-position',
    'user-top-read': 'user-top-read',
    'user-read-recently-played': 'user-read-recently-played',
  },
  Playlists: {
    'playlist-modify-private': 'playlist-modify-private',
    'playlist-read-collaborative': 'playlist-read-collaborative',
    'playlist-read-private': 'playlist-read-private',
    'playlist-modify-public': 'playlist-modify-public',
  },
};
