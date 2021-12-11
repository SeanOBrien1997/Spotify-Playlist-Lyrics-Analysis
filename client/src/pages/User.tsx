import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/user/Card';

const User = () => {
  const { token } = useParams();
  if (token) {
    return (
      <div className='App-header'>
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
