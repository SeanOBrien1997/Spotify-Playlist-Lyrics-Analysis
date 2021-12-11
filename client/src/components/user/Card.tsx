import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNapster, faSpotify } from '@fortawesome/free-brands-svg-icons';
import ReactCountryFlag from 'react-country-flag';
import './Card.css';

interface CardProps {
  token: string;
}

interface UserProfileAPIResponse {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}

const Card = (props: CardProps) => {
  const { token } = props;
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<UserProfileAPIResponse>();
  useEffect(() => {
    setLoading(true);
    async function fetchInfo() {
      const userInfo = await fetchUserInformation(token);
      setInfo(userInfo);
      setLoading(false);
    }
    fetchInfo();
  }, [token]);
  return loading ? (
    <div>
      <p>Loading</p>
    </div>
  ) : (
    <aside className='profile-card'>
      <header>
        <a
          href={info?.external_urls.spotify}
          target='_blank'
          rel='noopener noreferrer'
        >
          {
            <div className='profile-card-image-root'>
              {info?.images[0]?.url ? (
                <div className='profile-card-image-container'>
                  <img src={info.images[0].url} alt='User' />
                </div>
              ) : (
                <div className='profile-card-icon-container'>
                  <FontAwesomeIcon
                    icon={faNapster}
                    color='green'
                    size='4x'
                  ></FontAwesomeIcon>
                </div>
              )}
            </div>
          }
        </a>
        <h3>{info?.display_name}</h3>
        <div id='user-country'>
          {info?.country ? (
            <ReactCountryFlag countryCode={info.country} />
          ) : (
            <p></p>
          )}
        </div>
      </header>
      <div id='profile-bio'>
        <p>Followers: {info?.followers.total}</p>
        <p>Account Type: {info?.product}</p>
      </div>
      <ul id='profile-social-links'>
        <li>
          <a
            href={info?.external_urls.spotify}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faSpotify} color='green' size='1x' />
          </a>
        </li>
      </ul>
    </aside>
  );
};

const fetchUserInformation = async (
  token: string
): Promise<UserProfileAPIResponse> => {
  return new Promise<UserProfileAPIResponse>(async (resolve, reject) => {
    const SPOTIFY_ENDPOINT: string = 'https://api.spotify.com/v1/me';
    try {
      console.log('Sending spotify request');
      const response = await fetch(SPOTIFY_ENDPOINT, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      console.log('Response from spotify: ' + JSON.stringify(response));
      if (response.ok) {
        const userInfo = (await response.json()) as UserProfileAPIResponse;
        resolve(userInfo);
      } else {
        reject(`Invalid response from Spotify ${response.status}`);
      }
    } catch (error) {
      reject(
        `Unexpected error whilst fetching user information: ${JSON.stringify(
          error
        )}`
      );
    }
  });
};

export default Card;
