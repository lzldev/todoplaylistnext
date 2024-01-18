import Image from "next/image";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { SyncPlaylist } from "./SyncPlaylist";
import { getServerAuthSession } from "~/server/auth";

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

  const items = await (async () => {
    const first = await api.spotify.playlist_tracks.query({
      playlist_id: params.playlist,
    });

    const items = first.items;

    let forward = first;
    while (forward.next) {
      const uri = new URL(forward.next);
      console.log("uri", uri, "next offset ", uri.searchParams.get("offset")!);
      forward = await api.spotify.playlist_tracks.query({
        playlist_id: params.playlist,
        offset: parseInt(uri.searchParams.get("offset")!),
      });
      items.push(...forward.items);
    }

    return items;
  })();

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col border-muted md:max-w-2xl md:border-x-2">
        <div className="flex gap-x-4 p-4">
          {details.images?.at(0)?.url ? (
            <Image
              className="size-16"
              src={details.images?.at(0)!.url}
              width={details.images?.at(0)?.width ?? 100}
              height={details.images?.at(0)?.height ?? 100}
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
        <SyncPlaylist playlist={items} details={details} />
      </div>
    </div>
  );
}
