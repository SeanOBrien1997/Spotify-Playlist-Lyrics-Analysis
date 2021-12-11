import React from 'react';
import logo from '../logo.svg';
import { useParams } from 'react-router-dom';
import Card from '../components/user/Card';

const User = () => {
  const { token } = useParams();
  if (token) {
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
        <Card token={token}></Card>
      </div>
    );
  } else {
    return (
      <div>
        <p>token not defined</p>
      </div>
    );
  }
};

export default User;
