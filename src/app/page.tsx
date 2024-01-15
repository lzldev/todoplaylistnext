import Link from "next/link";
import { TrackQuery } from "./_components/TrackQuery";
import dynamic from "next/dynamic";
import { ActionButtons } from "./_components/ActionButtons";

const TrackList = dynamic(
  //FIXME: dont worry about it 🫡
  () => import("./_components/TrackList"),
  {
    ssr: false,
  },
);

export default async function Home() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-1 flex-grow flex-col gap-y-4 px-2 md:max-w-xl">
        <TrackQuery />
        <div className="flex justify-center md:hidden">
          <ActionButtons />
        </div>
        <div className="relative flex flex-col gap-y-2">
          <div className="absolute left-full top-0 hidden flex-col md:flex">
            <ActionButtons vertical />
          </div>
          <TrackList />
        </div>
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
