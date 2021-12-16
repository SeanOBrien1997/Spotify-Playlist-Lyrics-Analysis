import React, { useEffect, useState } from 'react';
import '../../App.css';
import NLTKResponse from '../../model/nltk/NLTKResponse';
import WordCloudDataPoint from '../../model/wordcloud/WordCloudDataPoint';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import WordCloud from 'react-d3-cloud';

type WordCloudProps = {
  data: NLTKResponse;
};

const SliderWordCloud = (props: WordCloudProps) => {
  const [min, SetMin] = useState<number>(
    calculateMinPossibleFrequency(props.data)
  );
  const [max, SetMax] = useState<number>(
    calculateMaxPossibleFrequency(props.data)
  );
  const [minPossible, _SetMinPossible] = useState<number>(
    calculateMinPossibleFrequency(props.data)
  );
  const [maxPossible, _SetMaxPossible] = useState<number>(
    calculateMaxPossibleFrequency(props.data)
  );
  const [active, SetActive] = useState<WordCloudDataPoint[]>(
    getWordCloudArray(props.data)
  );

  useEffect(() => {
    const possibleDataSet = getWordCloudArray(props.data);
    if (possibleDataSet) {
      const filtered = possibleDataSet.filter((frequency) => {
        return frequency.value <= max && frequency.value >= min;
      });
      SetActive(filtered);
    }
  }, [min, max]);

  return (
    <div>
      <div className='Slider-Container'>
        <p>
          Current Min: {min}, Current Max: {max}
        </p>
        <Range
          min={minPossible}
          max={maxPossible}
          onAfterChange={(value) => {
            SetMin(value[0]);
            SetMax(value[1]);
          }}
        />
      </div>
      {active ? (
        <div>
          <WordCloud
            data={active}
            fontSize={(word) => Math.log2(word.value) * 5}
            spiral={'archimedean'}
          />
        </div>
      ) : (
        <div>
          <p>Could not render wordcloud</p>
        </div>
      )}
    </div>
  );
};

const calculateMinPossibleFrequency = (obj: NLTKResponse): number => {
  let min = Number.MAX_SAFE_INTEGER;
  const responses = obj.body.responses;
  responses.forEach((response) => {
    const frequencies: number[] = Object.values(
      response.analysis.body.frequencies
    ) as number[];
    frequencies.forEach((frequency) => {
      if (frequency < min) {
        min = frequency;
      }
    });
  });
  return min;
};

const calculateMaxPossibleFrequency = (obj: NLTKResponse): number => {
  let max = Number.MIN_SAFE_INTEGER;
  const responses = obj.body.responses;
  responses.forEach((response) => {
    const frequencies: number[] = Object.values(
      response.analysis.body.frequencies
    ) as number[];
    frequencies.forEach((frequency) => {
      if (frequency > max) {
        max = frequency;
      }
    });
  });
  return max;
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

export default SliderWordCloud;
