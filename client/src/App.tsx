import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import User from './pages/User';
import Dashboard from './pages/Dashboard';
import Navbar from './components/nav/Navbar';
import About from './pages/About';

function App() {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/About' element={<About />}></Route>
          <Route path='/' element={<Login />}></Route>
          <Route path='/user/:token' element={<User />}></Route>
          <Route
            path='/user/:token/dashboard/:playlistid'
            element={<Dashboard />}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
