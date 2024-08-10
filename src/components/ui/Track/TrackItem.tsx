import Image from "next/image";
import { TrackItem as TrackItemType } from "~/models/Track";
import { motion } from "framer-motion";

type Props = {
  track: TrackItemType;
};

export default function TrackItem({ track }: Props) {
  return (
    <motion.li
      className="text-start bg-black p-8 rounded-3xl border border-indigo-500 shadow-lg z-0"
      initial={{ y: 150, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ type: "spring" }}
    >
      <p className="text-lg md:text-xl font-semibold mb-3">No.{track.id}</p>
      <div className="w-full aspect-[1/1] overflow-hidden rounded-3xl mb-4">
        <Image
          className="object-cover"
          width={track.thumbnail.width}
          height={track.thumbnail.height}
          src={track.thumbnail.url || "/noimg.png"}
          alt={track.name}
        />
      </div>
      <div className="grid grid-cols-1 gap-1">
        <p className="text-xl">Name: {track.name}</p>
        <p className="text-base">Album: {track.albumName}</p>
        <p className="text-base">Artist: {track.artistName}</p>
      </div>
    </motion.li>
  );
}
