import React from 'react';

const SERVER_URL: string = 'http://server';
const AUTH_ENDPOINT: string = 'auth/token';
const URL: string = `${SERVER_URL}/${AUTH_ENDPOINT}`;
export default function LoginForm() {
  return (
    <div className='App'>
      <header className='App-header'>
        <a href={URL} className='btn-spotify'>
          Login with Spotify
        </a>
      </header>
    </div>
  );
}
