"use client";

import { useTrackStore } from "../_stores/TrackStore";
import Image from "next/image";

const TrackList = () => {
  const tracks = useTrackStore((s) => s.tracks);

  return (
    <>
      {tracks.map((track, idx) => (
        <div
          key={idx}
          tabIndex={0}
          className="flex justify-between gap-x-4 p-2 first:mt-2"
          role="article"
        >
          <div>
            <Image
              className="size-16"
              src={track.image.at(-1)?.["#text"] ?? ""}
              width={200}
              height={200}
              alt={`${track.name} song cover`}
            />
          </div>
          <div className="flex flex-grow flex-col">
            <div className="flex flex-1 justify-between">
              <span>{track.name}</span>
              <span className="text-accent-foreground">{track.artist}</span>
            </div>
            <div className="flex flex-row-reverse">
              <span className="text-sm tracking-tight text-muted-foreground">
                added {track.create_at instanceof Date ? "true" : "false"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TrackList;
