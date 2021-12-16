import React from 'react';


const SERVER_URL: string = 'http://localhost:5001';
const AUTH_ENDPOINT: string = 'auth/login';
const URL: string = `${SERVER_URL}/${AUTH_ENDPOINT}`;
export default function LoginForm() {
  return (
    <div className='App'>
      <header className='App-header'>
        <a href={URL} className='btn-spotify'>
         <button className = 'LoginButton'> Login with Spotify </button> 
        </a>
      </header>
    </div>
  );
}
