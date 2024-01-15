"use client";

import { useTrackStore } from "../_stores/TrackStore";

const TrackList = () => {
  const tracks = useTrackStore((s) => s.tracks);
  return (
    <>
      {tracks.map((track) => (
        <div
          key={`${track.artist} ${track.name}`}
          className="flex justify-between py-2"
        >
          <span className="text-red-500">{track.artist}</span>
          <span>{track.name}</span>
        </div>
      ))}
    </>
  );
};

export default TrackList;
