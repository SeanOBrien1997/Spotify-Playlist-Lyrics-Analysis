import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tracks from '../model/spotify/Tracks';
import NLTKResponse from '../model/nltk/NLTKResponse';
import AudioFeatures from '../model/spotify/AudioFeatures';
import AudioAnalysisAPIResponse from '../model/spotify/AudioAnalysisAPIResponse';
import AudioFeaturesAPIResponse from '../model/spotify/AudioFeaturesAPIResponse';
import PlaylistTracksAPIResponse from '../model/spotify/PlaylistTracksAPIResponse';
import SliderWordCloud from '../components/d3/SliderWordCloud';
import ScatterChart from '../components/d3/ScatterChart';

const Dashboard = () => {
  const { token, playlistid } = useParams();

  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<Tracks[]>();
  const [loadingMessage, setLoadingMessage] = useState('Loading');
  const [analysisResponses, setAnalysisResponses] = useState<NLTKResponse>();
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures[]>();
  const [audioAnalysis, setAudioAnalysis] =
    useState<AudioAnalysisAPIResponse[]>();

  useEffect(() => {
    setLoadingMessage('Loading tracks');
    setLoading(true);
    async function fetchTracks() {
      if (token && playlistid) {
        const tracks = await fetchPlaylistTrackIDs(token, playlistid);
        setTracks(tracks);
        try {
          const response = await fetch('http://localhost:5001/nltk/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              tracks: tracks,
            }),
          });
          const analysisResponse = (await response.json()) as NLTKResponse;
          setAnalysisResponses(analysisResponse);
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      }
    }
    fetchTracks();
  }, [token, playlistid]);

  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setLoadingMessage('Fetching track audio features');
      setLoading(true);
      fetchAudioFeatures();
      setLoadingMessage('Fetching track audio analysis');
      setLoading(false);
    }
    async function fetchAudioFeatures() {
      if (token && tracks && tracks.length > 0) {
        try {
          const features = (await fetchAudioFeaturesForTracks(
            tracks,
            token
          )) as AudioFeatures[];
          setAudioFeatures(features);
        } catch (error) {
          console.error(`Error fetching audio features ${error}`);
        }
      }
    }
  }, [tracks]);

  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setLoading(true);
      setLoadingMessage('Fetching track audio analysis');
      fetchAudioAnalysis();
      setLoading(false);
    }
    async function fetchAudioAnalysis() {
      if (token && tracks && tracks.length > 0) {
        try {
          const analyses: AudioAnalysisAPIResponse[] =
            await fetchAudioAnalysisFortracks(tracks, token);
          setAudioAnalysis(analyses);
        } catch (error) {
          console.error(JSON.stringify(error));
        }
      }
    }
  }, [tracks]);

  return loading ? (
    <div>
      <p>{loadingMessage}...</p>
    </div>
  ) : (
    <div>
      <p>
        Number of tracks:{tracks?.length}
        Successes: {analysisResponses?.body.successes}
        Failures: {analysisResponses?.body.failures}
        Lyric Failures: {analysisResponses?.body.lyricFailures}
      </p>
      <div>
        {analysisResponses ? (
          <div>
            <SliderWordCloud data={analysisResponses} />
            <ScatterChart analyses={analysisResponses.body.responses} />
          </div>
        ) : (
          <p>No analysis data defined</p>
        )}
      </div>
      <div>
        {audioFeatures && audioFeatures.length > 0 ? (
          <div>
            <p>Audio features found</p>
            <p>Energy: {audioFeatures[0].energy}</p>
          </div>
        ) : (
          <div>
            <p>Audio features not found</p>
          </div>
        )}
      </div>
      <div>
        {audioAnalysis && audioAnalysis.length > 0 ? (
          <div>
            <p>Bars: {audioAnalysis[0].bars[0].start}</p>
          </div>
        ) : (
          <div>
            <p>Audio analysis data not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const fetchAudioAnalysisFortracks = async (
  tracks: Tracks[],
  token: string
): Promise<AudioAnalysisAPIResponse[]> => {
  return new Promise<AudioAnalysisAPIResponse[]>(async (resolve, reject) => {
    const promises: Promise<Response>[] = [];
    const responses: AudioAnalysisAPIResponse[] = [];
    for (const track of tracks) {
      try {
        const response = fetch(
          `https://api.spotify.com/v1/audio-analysis/${track.track.id}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        promises.push(response);
      } catch (error) {
        console.error(JSON.stringify(error));
        reject(
          `Error fetching Spotify track analysis data for ${track.track.name} by ${track.track.artists[0].name}`
        );
      }
    }
    Promise.allSettled(promises).then(async (results) => {
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const response =
            (await result.value.json()) as AudioAnalysisAPIResponse;
          responses.push(response);
        } else {
          console.error(`Promise for track was rejected ${result.reason}`);
        }
      }
    });
    resolve(responses);
  });
};

const fetchAudioFeaturesForTracks = async (
  tracks: Tracks[],
  token: string
): Promise<AudioFeatures[]> => {
  return new Promise<AudioFeatures[]>(async (resolve, reject) => {
    const endpoint = 'https://api.spotify.com/v1/audio-features?';
    const trackIds: string[] = [];
    for (let i = 0; i < tracks.length; i++) {
      trackIds.push(tracks[i].track.id);
    }
    try {
      const spotify_endpoint =
        endpoint +
        new URLSearchParams({
          ids: trackIds.join(','),
        });
      const response = await fetch(spotify_endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      if (response.ok) {
        const audioFeatureResponseObj =
          (await response.json()) as AudioFeaturesAPIResponse;
        resolve(audioFeatureResponseObj.audio_features);
      } else {
        console.error('Response not ok for audio features');
      }
    } catch (error) {
      reject(
        `Unexpected error when trying to fetch song features ${JSON.stringify(
          error
        )}`
      );
    }
  });
};

const fetchPlaylistTrackIDs = async (
  token: string,
  playlistID: string
): Promise<Tracks[]> => {
  return new Promise<Tracks[]>(async (resolve, reject) => {
    const SPOTIFY_ENDPOINT: string = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
    try {
      const response = await fetch(SPOTIFY_ENDPOINT, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      if (response.ok) {
        const trackResponse =
          (await response.json()) as PlaylistTracksAPIResponse;
        const tracks = trackResponse.items;
        resolve(tracks);
      } else {
        reject(`Invalid response received from Spotify ${response.status}`);
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      reject('Unexpected error whilst fetching track information');
    }
  });
};

export default Dashboard;
