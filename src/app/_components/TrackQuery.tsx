"use client";

import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/components/ui/popover";
import type { LASTFM_Track } from "../lib/validators";
import { useTrackStore } from "../_stores/TrackStore";
import { api } from "~/trpc/react";

export const TrackQuery = () => {
  const timeout = useRef<NodeJS.Timeout>();

  const [query, setQuery] = useState("");
  const addTrack = useTrackStore((s) => s.addTrack);

  const { data } = api.tracks.search.useQuery({ query });

  return (
    <div className="flex w-full flex-col py-4">
      <Popover>
        <input
          className="placeholder:text-dark bg-dark-background-dimmed w-full p-2"
          placeholder="search"
          onChange={(e) => {
            if (timeout.current) {
              clearTimeout(timeout.current);
            }

            const v = e.currentTarget.value;
            timeout.current = setTimeout(() => {
              console.log("updating query to=", v);
              setQuery(v);
            }, 200);
          }}
        />
        <PopoverTrigger>
          <div>OPEN</div>
        </PopoverTrigger>
        <PopoverContent>
          {data?.map((track) => (
            <div
              key={`${track.artist} ${track.name}`}
              className="flex justify-between"
              onClick={() => addTrack(track)}
            >
              <span className="text-red-500">{track.artist}</span>
              <span>{track.name}</span>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};
