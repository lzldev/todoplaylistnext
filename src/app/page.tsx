import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col gap-y-4 md:max-w-xl">
        <div className="flex w-full flex-col py-4">
          <input
            className="placeholder:text-dark bg-dark-background-dimmed w-full p-2"
            placeholder="search"
          />
        </div>
        <div className="py-20">Tracks Here</div>
      </div>
      <div className="flex w-full justify-end p-4 tracking-tight">
        <Link href={"https://github.com/lzldev"}>
          <span>
            @<span className="font-bold">lzldev</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
