"use client";

import { useState, type PropsWithChildren } from "react";

import clsx from "clsx";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/components/ui/dialog";
import { Input } from "./ui/components/ui/input";
import { Button } from "./ui/components/ui/button";
import { useConfigStore } from "../_stores/ConfigStore";
import { api } from "~/trpc/react";
import Image from "next/image";
import { useTrackStore } from "../_stores/TrackStore";
import { toast } from "sonner";
import type { LASTFM_RecentTrack } from "~/server/lib/validators";
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
} from "./ui/components/ui/alert-dialog";

export type ActionButtonsProps = {
  vertical?: boolean;
};

export const ActionButtons = ({ vertical }: ActionButtonsProps) => {
  const trackStore = useTrackStore();
  const configStore = useConfigStore();

  const syncMutate = api.user.recentTracks.useMutation();

  const [syncing, setSyncing] = useState(false);

  return (
    <div
      className={clsx(
        "flex gap-2",
        vertical && "flex-col",
        !vertical && "flex-row",
      )}
    >
      <OptionsDialog>
        <Button variant={"ghost"}>
          <Icon className="size-8 fill-foreground" icon={"radix-icons:gear"} />
        </Button>
      </OptionsDialog>
      <Button
        variant={"ghost"}
        onClick={async () => {
          if (syncing) {
            return;
          }

          //TODO:Extract into a hook.
          if (configStore.user === null) {
            toast.error("Last.fm user not set.");
            return;
          } else if (trackStore.tracks.length === 0) {
            toast.error("No tracks to Sync.");
            return;
          }

          setSyncing(true);

          const currentSync = new Date();

          const lastSync =
            trackStore.lastSync ?? trackStore.tracks.at(-1)!.created_at;

          const recentTracks = await syncMutate.mutateAsync({
            username: configStore.user.name,
          });

          const unsyncedIdx = recentTracks.findIndex(
            (v) => v.date.getTime() < lastSync.getTime(),
          );

          if (unsyncedIdx === 0) {
            toast("todo list up to date ^-^");
            trackStore.set({ lastSync: currentSync });
            setSyncing(false);

            return;
          } else if (unsyncedIdx === -1) {
            toast("no new scrobbles.");
            trackStore.set({ lastSync: currentSync });

            setSyncing(false);
            return;
          }

          const unsyncedScrobbledMap = new Map<string, LASTFM_RecentTrack>();
          for (let i = 0; i <= unsyncedIdx; i++) {
            unsyncedScrobbledMap.set(
              recentTracks[i]!.url.toUpperCase(),
              recentTracks[i]!,
            );
          }

          const todoTracks = trackStore.tracks.slice(0);

          for (const track of todoTracks) {
            if (track.scrobbled_at) {
              continue;
            }

            const s = unsyncedScrobbledMap.get(track.url.toUpperCase());
            if (!s) {
              continue;
            }

            track.scrobbled_at = s.date;
          }

          trackStore.set({ tracks: todoTracks, lastSync: currentSync });
          setSyncing(false);
          toast("Synced");
        }}
      >
        <Icon
          className={clsx("size-8 text-foreground", syncing && "animate-spin")}
          icon={"radix-icons:update"}
        />
      </Button>
      <ClearDialog>
        <Button variant={"ghost"}>
          <Icon className="size-8 fill-foreground" icon={"radix-icons:trash"} />
        </Button>
      </ClearDialog>
    </div>
  );
};

type ClearDialog = PropsWithChildren;

const ClearDialog = (props: ClearDialog) => {
  const trackStore = useTrackStore();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Warning</AlertDialogTitle>
          <AlertDialogDescription>
            This will clea all the scrobbled tracks from your playlist.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={"destructive"}
              onClick={() => {
                const copy = trackStore.tracks
                  .slice(0)
                  .filter((v) => !v.scrobbled_at);

                trackStore.set({ tracks: copy });
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

type OptionsDialogProps = PropsWithChildren;

const OptionsDialog = (props: OptionsDialogProps) => {
  const { user, setUser } = useConfigStore();

  const [localUsername, setLocalUsername] = useState(user?.name ?? "");

  const uquery = api.user.check.useMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        {!user && (
          <div className="flex gap-x-2">
            <Input
              placeholder="last.fm username"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.currentTarget.value)}
            />
            <Button
              variant={"outline"}
              onClick={async () => {
                const user = await uquery
                  .mutateAsync({
                    username: localUsername,
                  })
                  .catch((e) => {
                    throw e;
                  });

                setUser(user);
              }}
            >
              Search
            </Button>
          </div>
        )}
        {user && (
          <>
            <div className="flex min-h-[4rem] items-center gap-x-2 rounded-md p-2 ring-1 ring-muted">
              <Image
                className="size-12"
                src={user.image.at(0)?.["#text"] ?? ""}
                alt={`${user.name} Profile picture`}
                width={400}
                height={400}
              />
              <div>{user.name}</div>
            </div>
            <Button
              variant={"outline"}
              onClick={() => {
                setUser(null);
              }}
            >
              Clear
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
