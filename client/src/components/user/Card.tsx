import React, { useEffect, useMemo, useState } from 'react';

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
    <div>
      <p>
        Hello {info?.display_name}, from {info?.country}
      </p>
    </div>
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
