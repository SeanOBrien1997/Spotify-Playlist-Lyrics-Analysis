import Pitch from './Pitch';
import Timbre from './Timbre';

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

export default Segment;
