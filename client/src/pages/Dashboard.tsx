import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as d3 from 'd3';
import WordCloud from 'react-d3-cloud';

interface PlaylistTracksAPIResponse {
  href: string;
  items: Tracks[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

type Artist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

type Image = {
  height: number;
  url: string;
  width: number;
};

type Track = {
  album: {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
  };
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
};

type Tracks = {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: null;
  track: Track;
  video_thumbnail: {
    url: string;
  };
};

type Sentiment = {
  negative: number;
  neutral: number;
  positive: number;
  compound: number;
};

type AnalysisResponse = {
  analysis: {
    body: {
      frequencies: Object;
      sentiment: Sentiment;
    };
    statusCode: number;
  };
  track: Track;
};

type NLTKResponse = {
  body: {
    failures: number;
    lyricFailures: number;
    responses: AnalysisResponse[];
    successes: number;
  };
};

type AudioFeatureAPIResponse = {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
};

type AudioAnalysisMetaData = {
  analyzer_version: string;
  platform: string;
  detailed_status: string;
  status_code: number;
  timestamp: number;
  analysis_time: number;
  input_process: string;
};

type AudioAnalysisTrackData = {
  num_samples: number;
  duration: number;
  sample_md5: string;
  offset_seconds: number;
  window_seconds: number;
  analysis_sample_rate: number;
  analysis_channels: number;
  end_of_fade_in: number;
  start_of_fade_out: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  codestring: string;
  code_version: number;
  echoprintstring: string;
  echoprint_version: number;
  synchstring: string;
  synch_version: number;
  rhythmstring: string;
  rhythm_version: number;
};

type AudioAnalysisAPIResponse = {
  meta: AudioAnalysisMetaData;
  track: {};
  bars: [];
  beats: [];
  sections: [];
  segments: [];
  tatums: [];
};

const Dashboard = () => {
  const { token, playlistid } = useParams();

  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<Tracks[]>();
  const [loadingMessage, setLoadingMessage] = useState('Loading');
  const [analysisResponses, setAnalysisResponses] = useState<NLTKResponse>();
  const [audioFeatures, setAudioFeatures] =
    useState<AudioFeatureAPIResponse[]>();
  const [audioAnalysis, setAudioAnalysis] = useState();

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
          console.log('error');
          console.log(error);
        }
        setLoading(false);
      }
    }
    fetchTracks();
  }, [token, playlistid]);

  return loading ? (
    <div>
      <p>{loadingMessage}...</p>
    </div>
  ) : (
    <div>
      <p>Loaded</p>
      <p>
        {tracks?.length} {analysisResponses?.body.successes}{' '}
        {analysisResponses?.body.failures}
        {analysisResponses?.body.lyricFailures}
      </p>
      <p>{tracks ? getTrackName(tracks[0].track) : 'Nada'}</p>
      <p>{tracks ? tracks[0].track.artists[0].name : 'Nada'}</p>
      <div>
        {analysisResponses ? (
          <WordCloud data={getWordCloudArray(analysisResponses)}></WordCloud>
        ) : (
          <p>No analysis data defined</p>
        )}
      </div>
    </div>
  );
};

type WordCloudDataPoint = {
  text: string;
  value: number;
};

const getWordCloudArray = (obj: NLTKResponse): WordCloudDataPoint[] => {
  const responses = obj.body.responses;
  const data: WordCloudDataPoint[] = [];
  responses.forEach((response) => {
    const frequencies = response.analysis.body.frequencies;
    const keys = Object.keys(frequencies);
    const vals = Object.values(frequencies) as number[];
    keys.forEach((key, i) => {
      const dataPoint: WordCloudDataPoint = { text: key, value: vals[i] };
      data.push(dataPoint);
    });
  });
  console.log(data);
  return data;
};

const getTrackName = (track: Track) => {
  return track.name;
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
