import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';

const app = express();
dotenv.config();
const port: number = 5001;
const STATE_SEED: number = 16;

const LAMBDA_BASE_URL: string = 'http://lambda-nltk';
const LAMBDA_PORT: number = 8080;
const LAMBDA_ENDPOINT: string = '2015-03-31/functions/function/invocations';
const LAMBDA_URL: string = `${LAMBDA_BASE_URL}:${LAMBDA_PORT}/${LAMBDA_ENDPOINT}`;
const SPOTIFY_CLIENT_ID: string | undefined = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET: string | undefined =
  process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_ACCOUNTS_URL: string = 'https://accounts.spotify.com';

// https://developer.spotify.com/documentation/web-playback-sdk/guide/#login-component
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/auth/login', (_request, response) => {
  if (SPOTIFY_CLIENT_ID) {
    const scopes = [Scopes.Playlists['playlist-read-private']];
    const state: string = randomString(STATE_SEED);
    const auth_query_parameters = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scopes.join(' '),
      redirect_uri: 'http://localhost:5001/auth/callback',
      state: state,
    });
    const auth_endpoint: string = `${SPOTIFY_ACCOUNTS_URL}/authorize/?${auth_query_parameters.toString()}`;
    response.redirect(auth_endpoint);
  } else {
    console.error(`Spotify client ID is not defined: ${SPOTIFY_CLIENT_ID}`);
  }
});

app.get('/auth/callback', async (request, response) => {
  const code = request.query.code;
  if (code && SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) {
    const token_endpoint: string = `${SPOTIFY_ACCOUNTS_URL}/api/token`;
    const headers = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: SPOTIFY_CLIENT_ID,
        password: SPOTIFY_CLIENT_SECRET,
      },
    };
    const data = {
      grant_type: 'client_credentials',
    };
    try {
      const spotify_token_response = await axios.post(
        token_endpoint,
        qs.stringify(data),
        headers
      );
      const token = spotify_token_response.data.access_token;
      console.log(token);
      // const response_query = qs.stringify({
      //   token: token,
      // });
      response.redirect('http://localhost:9001/user/' + token);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  } else {
    console.error(`Code was not defined for callback: ${code}`);
  }
});

/**
 * TODO
 */
app.get('/auth/token', (request, response) => {});

const randomString = (length: number): string => {
  let text: string = '';
  const possible: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const lambdaRequest = (msg: string) => {
  console.log('Sending request to: ' + LAMBDA_URL);
  axios
    .post(LAMBDA_URL, {
      message: msg,
    })
    .then((res) => {
      console.log(res.status);
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
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
