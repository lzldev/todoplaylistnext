import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Separator } from "../_components/ui/components/ui/separator";
import { Button } from "../_components/ui/components/ui/button";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("spotify/playlists/0");
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col gap-y-4 border-muted md:max-w-2xl md:border-x-2">
        <div className="px-8 py-4">
          <h1>Spotify</h1>
        </div>
        <Separator />
        <Link className="px-8  py-4" href={"/api/auth/signin"}>
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  );
}
