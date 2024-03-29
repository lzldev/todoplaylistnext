/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { SpotifyLogoutButton } from "~/app/_components/SpotifyLoginButton";
import type { LayoutProps } from ".next/types/app/spotify/playlists/[id]/layout";

export default async function Home(props: LayoutProps) {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/spotify");
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col border-muted md:max-w-2xl md:border-x-2">
        <div className="flex items-center gap-x-4 p-4 ring ring-muted">
          <div className="size-16">
            <img
              className="rounded-full"
              src={session.user.image!}
              alt={`${session.user.name} profile picture`}
              width={80}
              height={80}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <span className="text-end">{session.user.name}</span>
            <SpotifyLogoutButton />
          </div>
        </div>
        {props.children}
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
