import Track from '../spotify/Track';
import Sentiment from './Sentiment';

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

export default AnalysisResponse;
