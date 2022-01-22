import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Navbar = () => {
  return (
    <div className='Navbar'>
      <div className='Heading'>Spotify Playlist Lyric Analyzer</div>
      <ul className='ul'>
        <li>
          <Link to={'/'}>
            <button className='Button'> Home </button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
