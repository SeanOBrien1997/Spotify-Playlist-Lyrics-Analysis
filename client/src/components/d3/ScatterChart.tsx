import { Chart, registerables } from 'chart.js';
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import AnalysisResponse from '../../model/nltk/AnalysisResponse';

type ScatterChartProps = {
  analyses: AnalysisResponse[];
};

const ScatterChart = (props: ScatterChartProps) => {
  Chart.register(...registerables);
  return (
    <div>
      <div>
        <Scatter data={getData(props.analyses)}></Scatter>
      </div>
    </div>
  );
};

const getData = (analyses: AnalysisResponse[]) => {
  const dataSet: { x: number; y: number }[] = [];
  const data = {
    labels: ['Scatter'],
    datasets: [
      {
        label: 'Sentiment Analysis Dataset',
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 40,
        pointRadius: 20,
        pointHitRadius: 5,
        data: dataSet,
      },
    ],
  };
  for (const analysis of analyses) {
    data.datasets[0].data.push({
      x: analysis.analysis.body.sentiment.positive,
      y: analysis.analysis.body.sentiment.negative,
    });
  }
  return data;
};

export default ScatterChart;
