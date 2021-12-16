import Bar from './audio/Bar';
import Beat from './audio/Beat';
import Section from './audio/Section';
import Segment from './audio/Segment';
import Tatum from './audio/Tatum';
import AudioAnalysisMetaData from './AudioAnalysisMetaData';
import AudioAnalysisTrackData from './AudioAnalysisTrackData';

type AudioAnalysisAPIResponse = {
  meta: AudioAnalysisMetaData;
  track: AudioAnalysisTrackData;
  bars: Bar[];
  beats: Beat[];
  sections: Section[];
  segments: Segment[];
  tatums: Tatum[];
};

export default AudioAnalysisAPIResponse;
