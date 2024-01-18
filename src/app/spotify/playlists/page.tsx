/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "../../_components/ui/components/ui/button";
import Image from "next/image";
import { api } from "~/trpc/server";
import { Playlists } from "./Playlists";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/spotify");
  }

  const playlists = await api.spotify.playlists.query({ page: 0 });

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col gap-y-4 border-muted *:px-4 md:max-w-2xl md:border-x-2">
        <div className="flex items-center gap-x-4 p-2 ring ring-muted">
          <div className="size-16">
            <Image
              className="rounded-full"
              src={session.user.image!}
              alt={`${session.user.name} profile picture`}
              width={80}
              height={80}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <span className="text-end">{session.user.name}</span>
            <Link href={"/api/auth/signout"}>
              <Button>Logout</Button>
            </Link>
          </div>
        </div>
        <Playlists playlists={playlists.items}></Playlists>
      </div>
      <div className="flex w-full justify-end border-t border-muted p-4 tracking-tight">
        <Link href={"https://github.com/lzldev"}>
          <span>
            @<span className="font-bold">lzldev</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
