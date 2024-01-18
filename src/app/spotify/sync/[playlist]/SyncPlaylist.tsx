"use client";

import { UpdateIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { toast } from "sonner";
import { Button } from "~/app/_components/ui/components/ui/button";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/app/_components/ui/components/ui/alert-dialog";
import { Separator } from "~/app/_components/ui/components/ui/separator";
import type {
  spt_get_playlist_details_reponse,
  spt_get_playlist_items_response,
  spt_get_recent_tracks_response,
  spt_playlist_track,
} from "~/server/lib/spotify";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useState } from "react";

export type SyncPlaylistProps = {
  details: spt_get_playlist_details_reponse;
  playlist: spt_playlist_track[];
};

type diffMap = Map<string, spt_get_recent_tracks_response["items"][number]>;

export const SyncPlaylist = ({ playlist, details }: SyncPlaylistProps) => {
  const recent_tracks = api.spotify.recent_tracks.useMutation();
  const [diffMap, setDiffmap] = useState<diffMap>(new Map());
  const [tracks_to_be_deleted, setTbdtracks] = useState<spt_playlist_track[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const canCommit = tracks_to_be_deleted.length > 0;

  return (
    <>
      <div className="flex flex-col gap-y-2 p-4">
        <Button
          disabled={isLoading}
          className="flex justify-center py-4"
          onClick={async () => {
            setIsLoading(true);
            const diffMap = await (async () => {
              const tracks = await recent_tracks.mutateAsync({});
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

            const tbd = playlist.filter((t) => diffMap.get(t.track.uri));
            setDiffmap(diffMap);
            setTbdtracks(tbd);
            setIsLoading(false);
          }}
        >
          <UpdateIcon
            className={clsx("size-8", isLoading && "animate-spin")}
          ></UpdateIcon>
        </Button>
        <CommitDialog
          playlist_id={details.id}
          snapshot_id={details.snapshot_id}
          tracks_to_be_deleted={tracks_to_be_deleted}
        >
          <Button
            disabled={!canCommit}
            variant={canCommit ? "destructive" : "ghost"}
          >
            {diffMap.size !== 0
              ? canCommit
                ? "Commit"
                : "no Tracks found"
              : ""}
          </Button>
        </CommitDialog>
      </div>
      <Separator />
      <div className="flex flex-col px-4 pt-4">
        <span className="text-end text-muted-foreground">
          {playlist.length} tracks
        </span>
        {playlist.map((track) => (
          <div
            key={track.track.id}
            className={clsx(
              "flex justify-between",
              diffMap.get(track.track.uri) && "bg-destructive text-muted",
            )}
          >
            <span>
              <span className="font-mono tracking-tight">
                {track.track.name}
              </span>
            </span>
            {/* {diffMap.get(track.track.uri) && (
              <>
                <div className="mx-2 h-0.5 flex-grow self-center bg-destructive"></div>
                <span className="text-destructive">SCROBBLED</span>
              </>
            )} */}
          </div>
        ))}
      </div>
    </>
  );
};

type CommitDialog = {
  snapshot_id: string;
  playlist_id: string;
  tracks_to_be_deleted: spt_playlist_track[];
} & PropsWithChildren;

const CommitDialog = ({
  playlist_id,
  snapshot_id,
  tracks_to_be_deleted,
  ...props
}: CommitDialog) => {
  const router = useRouter();
  const delete_tracks = api.spotify.delete_tracks.useMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Warning</AlertDialogTitle>
          <AlertDialogDescription>
            this will delete {tracks_to_be_deleted.length} tracks from the
            playlist.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={"destructive"}
              onClick={async () => {
                const res = await delete_tracks.mutateAsync({
                  playlist_id,
                  snapshot_id,
                  tracks: tracks_to_be_deleted.map((t) => ({
                    uri: t.track.uri,
                  })),
                });

                router.refresh();
                return;
              }}
            >
              Clear
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
