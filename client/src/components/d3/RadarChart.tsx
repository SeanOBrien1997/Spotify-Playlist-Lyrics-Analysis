import React from 'react';
import { Radar } from 'react-chartjs-2';
import AudioFeatures from '../../model/spotify/AudioFeatures';

type RadarChartProps = {
  features: AudioFeatures[];
};

const RadarChart = (props: RadarChartProps) => {
  const features = props.features;
  const labels = [
    'acousticness',
    'danceability',
    'energy',
    'instrumentalness',
    'liveness',
    'loudness',
    'speechiness',
  ];

  const accousticness: number[] = [];
  const danceability: number[] = [];
  const energy: number[] = [];
  const instrumentalness: number[] = [];
  const liveness: number[] = [];
  const loudness: number[] = [];
  const speechiness: number[] = [];

  for (const feature of features) {
    accousticness.push(feature.acousticness);
    danceability.push(feature.danceability);
    energy.push(feature.energy);
    instrumentalness.push(feature.instrumentalness);
    liveness.push(feature.liveness);
    loudness.push(feature.loudness);
    speechiness.push(feature.speechiness);
  }

  const avg_acousticness = getAverage(accousticness);
  const avg_dance = getAverage(danceability);
  const avg_energy = getAverage(energy);
  const avg_instru = getAverage(instrumentalness);
  const avg_live = getAverage(liveness);
  const avg_loud = getAverage(loudness);
  const avg_speech = getAverage(speechiness);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Audio Features',
        backgroundColor: 'rgba(220,220,220,0.2)',
        pointBackgroundColor: 'rgba(220,220,220,1)',
        data: [
          avg_acousticness,
          avg_dance,
          avg_energy,
          avg_instru,
          avg_live,
          avg_loud,
          avg_speech,
        ],
      },
    ],
  };

  return (
    <div>
      <div>
        <Radar data={data} />
      </div>
    </div>
  );
};

const getAverage = (data: number[]): number => {
  if (data.length > 0) {
    return data.reduce((a, b) => a + b, 0) / data.length;
  } else {
    return 0;
  }
};

export default RadarChart;
