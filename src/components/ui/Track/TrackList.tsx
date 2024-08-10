import { TrackList as TrackListType } from "~/models/Track";
import TrackItem from "./TrackItem";

type Props = {
  tracks: TrackListType;
};

export default function TrackList({ tracks }: Props) {
  return (
    <ul className="mb-10 max-w-[500px] grid grid-cols-1 gap-12 mx-auto">
      {tracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </ul>
  );
}
