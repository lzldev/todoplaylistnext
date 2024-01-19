import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { SyncPlaylist, type SyncPlaylistProps } from "./SyncPlaylist";
import { getServerAuthSession } from "~/server/auth";
import { type spt_get_playlist_items_response } from "~/server/lib/spotify";
import { Suspense } from "react";
import { Separator } from "~/app/_components/ui/components/ui/separator";
import { Skeleton } from "~/app/_components/ui/components/ui/skeleton";

export default async function Page({
  params,
}: {
  params: { playlist: string };
}) {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/spotify");
  }

  if (!params.playlist) {
    return redirect("spotify/playlists");
  }

  const details = await api.spotify.playlist_details.query({
    playlist_id: params.playlist,
  });

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col border-muted md:max-w-2xl md:border-x-2">
        <div className="flex gap-x-4 p-4">
          {details.images?.at(-1)?.url ? (
            <img
              priority
              className="size-16 object-cover"
              src={details.images?.at(0)!.url}
              width={details.images?.at(0)?.width ?? 200}
              height={details.images?.at(0)?.height ?? 200}
              alt={"Playlist Cover"}
            />
          ) : (
            <div className="flex size-16 items-center justify-center bg-muted text-6xl">
              ?
            </div>
          )}
          <div className="flex flex-grow items-center text-start align-middle text-xl">
            {details.name}
          </div>
        </div>
        <Separator />

        <Suspense
          fallback={
            <>
              <div className="flex flex-col gap-y-2 p-4">
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
              </div>
              <Separator />
              <div className="flex flex-col px-4 pt-4">
                <Skeleton className="mb-1 h-6 w-1/6 self-end" />
                {new Array(details.tracks.total).fill(null).map((_, idx) => (
                  <Skeleton key={idx} className="my-1 h-6" />
                ))}
              </div>
            </>
          }
        >
          <SyncSkeleton details={details} />
        </Suspense>
      </div>
    </div>
  );
}

const SyncSkeleton = async ({
  details,
}: {
  details: SyncPlaylistProps["details"];
}) => {
  const n = Math.ceil(details.tracks.total / 100);

  const items = await (async () => {
    const fetches: PromiseSettledResult<spt_get_playlist_items_response>[] =
      await Promise.allSettled(
        new Array(n).fill(undefined).map((v, idx) =>
          api.spotify.playlist_tracks.query({
            playlist_id: details.id,
            offset: 100 * idx,
          }),
        ),
      );

    return fetches.reduce(
      (pv, cv) => {
        if (cv.status === "rejected") {
          throw cv;
        }

        pv.push(...cv.value.items);
        return pv;
      },
      [] as spt_get_playlist_items_response["items"],
    );
  })();

  return (
    <>
      <SyncPlaylist details={details} playlist={items} />
    </>
  );
};
