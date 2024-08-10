export type TrackItem = {
  id: number;
  name: string;
  albumName: string;
  artistName: string;
  thumbnail: {
    width: number;
    height: number;
    url: string | null;
  };
};

export type TrackList = TrackItem[];
