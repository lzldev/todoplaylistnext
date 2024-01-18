/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Playlists, PlaylistsSkeleton } from "../Playlists";
import { Suspense } from "react";
import type { PageProps } from ".next/types/app/spotify/playlists/[id]/page";

export default async function Home(props: PageProps) {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/spotify");
  }

  return (
    <Suspense fallback={<PlaylistsSkeleton />}>
      <Playlists pageParam={props.params.id}></Playlists>
    </Suspense>
  );
}
