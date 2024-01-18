"use client";

import { UpdateIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/app/_components/ui/components/ui/button";
import { Separator } from "~/app/_components/ui/components/ui/separator";
import type {
  spt_get_playlist_details_reponse,
  spt_get_playlist_items_response,
  spt_get_recent_tracks_response,
} from "~/server/lib/spotify";
import { api } from "~/trpc/react";

type SyncPlaylistProps = {
  details: spt_get_playlist_details_reponse;
  playlist: spt_get_playlist_items_response["items"];
};

type diffMap = Map<string, spt_get_recent_tracks_response["items"][number]>;

export const SyncPlaylist = ({ playlist, details }: SyncPlaylistProps) => {
  const [diff, setDiff] = useState<diffMap>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const recent_tracks = api.spotify.recent_tracks.useMutation();

  return (
    <>
      <Separator />
      <div className="flex flex-col gap-y-2 p-4">
        <Button
          disabled={isLoading}
          className="flex justify-center py-4"
          onClick={async () => {
            setIsLoading(true);
            const diffMap = await (async () => {
              const tracks = await recent_tracks.mutateAsync({});
              console.log("Tracks ->", tracks.items);
              const map = new Map<
                string,
                spt_get_recent_tracks_response["items"][number]
              >();

              for (const track of tracks.items) {
                map.set(track.track.uri, track);
              }
              return map;
            })().catch(() => {
              return;
            });

            if (!diffMap) {
              setIsLoading(false);
              toast.error("error loading recent tracks :c");
              return;
            }

            console.log(diffMap);
            setDiff(diffMap);
            setIsLoading(false);
          }}
        >
          <UpdateIcon
            className={clsx("size-8", isLoading && "animate-spin")}
          ></UpdateIcon>
        </Button>
        <Button
          disabled={diff.size === 0}
          variant={diff.size === 0 ? "ghost" : "destructive"}
        >
          Commit
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col px-4 pt-4">
        <span className="text-end text-muted-foreground">
          {playlist.length} tracks
        </span>
        {playlist.map((track) => (
          <div key={track.track.id} className="flex justify-between">
            <span>
              <span className="font-mono tracking-tight">
                {track.track.name}
              </span>
            </span>
            {diff.get(track.track.uri) && (
              <>
                <div className="mx-2 h-0.5 flex-grow self-center bg-destructive"></div>
                <span className="text-destructive">SCROBBLED</span>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
