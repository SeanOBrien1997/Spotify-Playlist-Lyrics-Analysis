import Tracks from './Tracks';

interface PlaylistTracksAPIResponse {
  href: string;
  items: Tracks[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export default PlaylistTracksAPIResponse;
