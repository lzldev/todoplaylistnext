import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Separator } from "./_components/ui/components/ui/separator";
import { Button } from "./_components/ui/components/ui/button";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/home");
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col gap-y-4 border-muted *:px-4 md:max-w-2xl md:border-x-2">
        <h1>Login</h1>
        <Separator />
        <Link href={"/api/auth/signin"}>
          <Button>Login</Button>
        </Link>
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
