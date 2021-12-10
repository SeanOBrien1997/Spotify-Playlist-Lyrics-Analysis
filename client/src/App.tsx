import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import User from './pages/User';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/user/:token' element={<User />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
