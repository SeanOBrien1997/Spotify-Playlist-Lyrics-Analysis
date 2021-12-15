import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const Navbar = () => {
  return (
    <div className = 'Navbar'>
      <ul className='ul'>
        <li>
        <Link to={'/'}>
         <button className ='Button'> Home </button>
        </Link>
        </li >

        <li>
        <Link to={'/About'}>
         <button className ='AboutButton'> About </button>
        </Link>
        </li>
      </ul>
     

      

    </div>
  );
};

export default Navbar;
