import React from 'react';
import logo from '../logo.svg';
import LoginForm from '../components/spotify/LoginForm';

export default function Login() {
  return (
    <div>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit the <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <LoginForm></LoginForm>
      </header>
    </div>
  );
}
