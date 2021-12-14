import express, { request, response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';
import cors from 'cors';
//@ts-ignore
import { getLyrics } from 'genius-lyrics-api'; // no types available through source or DefinitelyTyped.

const app = express();
const port: number = 5001;

app.use(
  cors({
    origin: 'http://localhost:9001',
  })
);
app.use(express.json({ limit: '100mb' }));
dotenv.config();

const LAMBDA_BASE_URL: string = 'http://lambda-nltk';
const LAMBDA_PORT: number = 8080;
const LAMBDA_ENDPOINT: string = '2015-03-31/functions/function/invocations';
const LAMBDA_URL: string = `${LAMBDA_BASE_URL}:${LAMBDA_PORT}/${LAMBDA_ENDPOINT}`;

const SPOTIFY_CLIENT_ID: string | undefined = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET: string | undefined =
  process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_ACCOUNTS_URL: string = 'https://accounts.spotify.com';
const SPOTIFY_LOGIN_REDIRECT_URI: string =
  'http://localhost:5001/auth/callback';
const SPOTIFY_TOKEN_URL: string = `${SPOTIFY_ACCOUNTS_URL}/api/token`;
const STATE_SEED: number = 16;

const GENIUS_CLIENT_ID: string | undefined = process.env.GENIUS_CLIENT_ID;
const GENIUS_CLIENT_SECRET: string | undefined =
  process.env.GENIUS_CLIENT_SECRET;
const GENIUS_CLIENT_ACCESS_TOKEN: string | undefined =
  process.env.GENIUS_CLIENT_ACCESS_TOKEN;

/**
 * Starts express server.
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/**
 * Acts as route to redirect to Spotify API authentication with required auth scopes.
 * @see https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
 */
app.get('/auth/login', (_request, response) => {
  if (SPOTIFY_CLIENT_ID) {
    const scopes = [
      Scopes.Playlists['playlist-read-private'],
      Scopes.Users['user-read-private'],
      Scopes.Users['user-read-email'],
    ];
    const scope: string = scopes.join(' ');
    const state: string = randomString(STATE_SEED);
    const auth_query_parameters = {
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_LOGIN_REDIRECT_URI,
      state: state,
    };
    const auth_endpoint: string = `${SPOTIFY_ACCOUNTS_URL}/authorize?${qs.stringify(
      auth_query_parameters
    )}`;
    response.redirect(auth_endpoint);
  } else {
    console.error(`Spotify client ID is not defined: ${SPOTIFY_CLIENT_ID}`);
  }
});

/**
 * Acts as callback route to generate token using authorization code received after logging in.
 * @see https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
 */
app.get('/auth/callback', async (request, response) => {
  const code = request.query.code;
  const state = request.query.state;
  if (code && state && SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) {
    const authOptions = {
      url: `${SPOTIFY_ACCOUNTS_URL}/api/token`,
      form: {
        code: code,
        redirect_uri: SPOTIFY_LOGIN_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
        ).toString('base64')}`,
      },
    };
    try {
      const spotify_token_response = await axios.post(
        SPOTIFY_TOKEN_URL,
        qs.stringify(authOptions.form),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: authOptions.headers.Authorization,
          },
        }
      );
      if (spotify_token_response.status === 200) {
        const token = spotify_token_response.data.access_token;
        console.log(token);
        response.redirect(`http://localhost:9001/user/${token}`);
      } else {
        console.log(
          `Invalid status code received by Spotify API: ${spotify_token_response.status}`
        );
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  } else {
    console.error(`Code or state was not defined for callback:
    Code: ${code}
    State: ${state}`);
  }
});

/**
 * TODO
 */
app.get('/auth/token', (request, response) => {});

app.post('/nltk/stats', async (request, response) => {
  console.log(request.body);
  const tracks = request.body.tracks as Tracks[];
  const trackLyrics = new Map<Tracks, string>();
  let successes = 0;
  let failures = 0;
  let lyricFailures = 0;
  for (const track of tracks) {
    const trackName = track.track.name;
    const trackArtists = track.track.artists;
    console.log(`${trackName} by ${trackArtists[0].name}`);
    const geniusOptions = {
      apiKey: GENIUS_CLIENT_ACCESS_TOKEN,
      title: trackName,
      artist: trackArtists[0].name,
      optimizeQuery: true,
    };
    const lyrics: string = await getLyrics(geniusOptions);
    if (lyrics) {
      trackLyrics.set(track, lyrics);
    } else {
      console.error(
        `Could not get lyrics for ${track.track.name} by ${track.track.artists[0].name}`
      );
      lyricFailures++;
    }
  }

  const lambdaResponses = new Map<Tracks, Object>();
  const lambdaPromises: Promise<Object>[] = [];

  for (const [track, lyrics] of trackLyrics) {
    try {
      const response = await lambdaRequest(lyrics);
      lambdaResponses.set(track, response);
      successes++;
    } catch (error) {
      console.error(
        `Error invoking the lamba service ${JSON.stringify(error)}`
      );
      failures++;
    }
  }

  console.log('Total tracks polled for ' + tracks.length);
  console.log(
    `successes: ${successes} failures: ${failures} lyric fails: ${lyricFailures}`
  );
  const formattedResponse = [];
  for (const [track, response] of lambdaResponses) {
    console.log(
      track.track.name + ' by ' + track.track.artists[0].name + ' was analysed'
    );
    formattedResponse.push({
      track: track.track,
      analysis: response,
    });
    console.log(JSON.stringify(response));
  }
  response.status(200).json({
    body: {
      successes: successes,
      failures: failures,
      lyricFailures: lyricFailures,
      responses: formattedResponse,
    },
  });
});

const randomString = (length: number): string => {
  let text: string = '';
  const possible: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const lambdaRequest = async (msg: string): Promise<Object> => {
  return new Promise<Object>(async (resolve, reject) => {
    try {
      const response = await axios.post(LAMBDA_URL, {
        message: msg,
      });
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject(
          `Invalid status code received when sending lyrics to NLTK ${response.status}`
        );
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      reject('Unexpected error when invoking the Lambda service.');
    }
  });
  console.log('Sending request to: ' + LAMBDA_URL);
};

const Scopes = {
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

type Image = {
  height: number;
  url: string;
  width: number;
};

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
