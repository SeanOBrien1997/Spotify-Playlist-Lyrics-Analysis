import React from 'react';
import { Bar } from 'react-chartjs-2';
import { isLabeledStatement } from 'typescript';


type BarChartProps = {
  successes: number;
  failures: number;
  lyricFailures: number;
};

const BarChart = (props: BarChartProps) => {
  const successes = props.successes;
  const failures = props.failures;
  const lyricFailures = props.lyricFailures;
  
  const data={
    labels:['Successes','Failures','Lyric Failures'],
    datasets: [
        {
            label: 'Success rate of Analysed songs',
            data: [successes,failures,lyricFailures ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)'
              ],
              borderWidth: 1
            }]
  };
  return (
    <div>
      <div>
        <Bar data={data}></Bar>
      </div>
    </div>
  );
}
export default BarChart;
