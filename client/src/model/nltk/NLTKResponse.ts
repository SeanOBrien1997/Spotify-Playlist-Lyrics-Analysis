import AnalysisResponse from './AnalysisResponse';

type NLTKResponse = {
  body: {
    failures: number;
    lyricFailures: number;
    responses: AnalysisResponse[];
    successes: number;
  };
};

export default NLTKResponse;
