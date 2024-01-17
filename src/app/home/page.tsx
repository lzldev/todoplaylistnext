import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "../_components/ui/components/ui/button";
import { TestThing } from "./testthing";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col gap-y-4 border-muted *:px-4 md:max-w-2xl md:border-x-2">
        <Link href={"/api/auth/signout"}>
          <Button>Logout</Button>
        </Link>
        <TestThing />
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
