"use client";

import Link from "next/link";
import { useTrackStore } from "../_stores/TrackStore";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";

const TrackList = () => {
  const { tracks, clearTrack, scrobbleTrack } = useTrackStore((s) => ({
    tracks: s.tracks,
    scrobbleTrack: s.scrobbleTrack,
    clearTrack: s.clearTrack,
  }));

  return (
    <>
      {tracks.map((track, idx) => (
        <div
          key={`${track.name} ${track.created_at.getTime()}`}
          tabIndex={0}
          className="group/track flex justify-between gap-x-4 p-2 first:mt-2"
          role="article"
        >
          <div className="relative -mr-4 hidden min-h-full w-0 md:group-focus-within/track:flex md:group-hover/track:flex">
            <div className="absolute right-full flex h-full flex-col-reverse items-end justify-between pr-12">
              <div
                className="group/scrobble flex select-none items-center justify-center overflow-clip bg-background"
                onClick={() => clearTrack(idx)}
              >
                <span className="translate-x-full transition-transform group-hover/scrobble:translate-x-0">
                  clear
                </span>
                <Icon
                  icon={"radix-icons:trash"}
                  className="z-10 size-6 bg-background fill-red-400"
                />
              </div>
              <div
                className={clsx(
                  "flex select-none items-center justify-center overflow-clip bg-background",
                  !track.scrobbled_at && "group/scrobble",
                  !!track.scrobbled_at && "text-muted-foreground",
                )}
                onClick={() => {
                  if (track.scrobbled_at) {
                    return;
                  }
                  scrobbleTrack(idx);
                }}
              >
                <span className="translate-x-full transition-transform group-hover/scrobble:translate-x-0 ">
                  scrobble
                </span>
                <Icon
                  icon={"radix-icons:play"}
                  className="z-10 size-6 bg-background fill-red-400"
                />
              </div>
            </div>
          </div>
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
              <Link href={track.url}>
                <span className="cursor-pointer hover:underline">
                  {track.name}
                </span>
              </Link>
              <span className="text-accent-foreground">{track.artist}</span>
            </div>
            <div className="flex items-center justify-between font-mono text-sm tracking-tighter">
              <div className="flex gap-x-4">
                <div
                  className="group/scrobble flex select-none items-center justify-center overflow-clip bg-background md:hidden"
                  onClick={() => clearTrack(idx)}
                >
                  <Icon
                    icon={"radix-icons:trash"}
                    className="z-10 size-6 bg-background"
                  />
                </div>
                {
                  //:)
                }
                {track.scrobbled_at ? (
                  <span className="self-end font-mono text-red-400">
                    {track.scrobbled_at instanceof Date
                      ? track.scrobbled_at.getTime()
                      : "ooopsie ;c"}
                  </span>
                ) : (
                  <div
                    className="group/scrobble flex select-none items-center justify-center overflow-clip bg-background md:hidden"
                    onClick={() => {
                      if (track.scrobbled_at) {
                        return;
                      }
                      scrobbleTrack(idx);
                    }}
                  >
                    <Icon
                      icon={"radix-icons:play"}
                      className="z-10 size-6 bg-background"
                    />
                  </div>
                )}
                {
                  //:)
                }
              </div>
              <span className="self-end text-muted-foreground">
                {track.created_at instanceof Date
                  ? track.created_at.getTime()
                  : "oopsie"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TrackList;
