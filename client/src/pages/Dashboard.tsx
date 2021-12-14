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

type Bar = {
  start: number;
  duration: number;
  confidence: number;
};

type Beat = {
  start: number;
  duration: number;
  confidence: number;
};

type Section = {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
};

type Pitch = number;
type Timbre = Pitch;

type Segment = {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max: number;
  loudness_max_time: number;
  loudness_end: number;
  pitches: Pitch[];
  timbre: Timbre[];
};

type Tatum = Beat;

type AudioAnalysisAPIResponse = {
  meta: AudioAnalysisMetaData;
  track: AudioAnalysisTrackData;
  bars: Bar[];
  beats: Beat[];
  sections: Section[];
  segments: Segment[];
  tatums: Tatum[];
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

  useEffect(() => {
    if (tracks) {
      console.log('Running');
      console.log(tracks);
      setLoadingMessage('Fetching track audio features');
      setLoading(true);
      fetchAudioFeatures();
    }
    async function fetchAudioFeatures() {
      if (token && tracks) {
        try {
          const features = await fetchAudioFeaturesForTracks(tracks, token);
          console.log(Object.keys(features));
          setAudioFeatures(features);
          console.log('Audio features updated');
        } catch (error) {
          console.error(`Error fetching audio features ${error}`);
        }
      }
      setLoading(false);
    }
  }, [tracks]);

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
          <WordCloud data={getWordCloudArray(analysisResponses)} />
        ) : (
          <p>No analysis data defined</p>
        )}
      </div>
      <div>
        {audioFeatures ? (
          <div>
            <p>Audio features found</p>
            <p>Energy: {audioFeatures.length}</p>
          </div>
        ) : (
          <div>
            <p>Audio features not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

type WordCloudDataPoint = {
  text: string;
  value: number;
};

const getScatterPlotArray = (obj: NLTKResponse): ScatterPlotData[] => {
  const data: ScatterPlotData[] = [];
  const responses = obj.body.responses;
  responses.forEach((response) => {
    const positive = response.analysis.body.sentiment.positive;
    const negative = response.analysis.body.sentiment.negative;
    data.push({
      positive: positive,
      negative: negative,
    });
  });
  return data;
};

type ScatterPlotData = {
  positive: number;
  negative: number;
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
  return data;
};

const getTrackName = (track: Track) => {
  return track.name;
};

const fetchAudioFeaturesForTracks = async (
  tracks: Tracks[],
  token: string
): Promise<AudioFeatureAPIResponse[]> => {
  return new Promise<AudioFeatureAPIResponse[]>(async (resolve, reject) => {
    let endpoint = 'https://api.spotify.com/v1/audio-features?ids=';
    for (let i = 0; i < tracks.length - 1; i++) {
      endpoint += tracks[i].track.id + '%2';
    }
    endpoint += tracks[tracks.length - 1].track.id;
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      if (response.ok) {
        type t = {
          audio_features: AudioFeatureAPIResponse[];
        };
        const audioFeatureResponseObj = (await response.json()) as t;
        const audioFeatureResponse = audioFeatureResponseObj.audio_features;
        resolve(audioFeatureResponse);
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
