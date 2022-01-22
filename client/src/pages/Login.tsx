import React from 'react';
import logo from '../Spotify-Icon-Logo.wine.svg';
import LoginForm from '../components/spotify/LoginForm';

export default function Login() {
  return (
    <div>
      
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <LoginForm></LoginForm>
        <div className= "Paragraph">
        <p className = "paragraph">Our spotify lyric playlist analyser uses sentiment analysis to classifying the polarity of a playlist to show whether the songs area positive, negative, or neutral.
            The application also displays information such as the most frequent words in songs and various Audio features such as danceability, loudness and evergy etc.

        </p>
        </div>
      </header>
    </div>
  );
}
