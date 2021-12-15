import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Navbar = () => {
  return (
    <div>
      <ul>
        <Link to={'/'}>
          <li>Home</li>
        </Link>
      </ul>
    </div>
  );
};

export default Navbar;
