"use client";

import { useEffect, useRef, useState } from "react";
import { useTrackStore } from "../_stores/TrackStore";
import { api } from "~/trpc/react";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/components/ui/command";
import { Button } from "./ui/components/ui/button";
import { SymbolIcon } from "@radix-ui/react-icons";

export const TrackQuery = () => {
  const timeout = useRef<NodeJS.Timeout>();

  const [query, setQuery] = useState("");
  const addTrack = useTrackStore((s) => s.addTrack);
  const [open, setOpen] = useState(false);

  const { data, isFetching } = api.tracks.search.useQuery(
    { query },
    {
      enabled: !!query,
    },
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex w-full flex-col py-4">
      <Button variant="ghost" className="gap-x-2" onClick={() => setOpen(true)}>
        Add Track
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search"
          onFocus={() => {
            if (!open) {
              setOpen(true);
            }
          }}
          onValueChange={(value) => {
            if (timeout.current) {
              clearTimeout(timeout.current);
            }

            const v = value;

            timeout.current = setTimeout(() => {
              console.log("updating query to=", v);
              setQuery(v);
            }, 200);
          }}
        />
        <CommandList>
          {isFetching && (
            <div className="flex w-full justify-center py-6">
              <SymbolIcon className="size-6 animate-spin duration-1000" />
            </div>
          )}
          {!isFetching &&
            data?.map((track, idx) => (
              <CommandItem
                key={`${track.artist} ${track.name}`}
                tabIndex={idx}
                className="flex items-center justify-between"
                onSelect={() => addTrack(track)}
                value={query + idx}
              >
                <div className="flex w-full flex-grow items-baseline justify-between">
                  <span>{track.name}</span>
                  <span className="text-accent-foreground">{track.artist}</span>
                </div>
              </CommandItem>
            ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
};
