import React from 'react';
import logo from '../logo.svg';
import { useParams } from 'react-router-dom';

const User = () => {
  const { token } = useParams();
  return (
    <div>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
      <p>{token}</p>
    </div>
  );
};

export default User;
