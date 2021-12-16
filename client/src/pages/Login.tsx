import React from 'react';
import logo from '../Spotify-Icon-Logo.wine.svg';
import LoginForm from '../components/spotify/LoginForm';

export default function Login() {
  return (
    <div>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <LoginForm></LoginForm>
      </header>
    </div>
  );
}
