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
      <div className="border-muted flex w-full flex-1 flex-grow flex-col gap-y-4 *:px-4 md:max-w-2xl md:border-x-2">
        <TrackQuery />
        <div className="flex justify-center border-y py-2 md:hidden">
          <ActionButtons />
        </div>
        <div className="border-muted relative flex flex-col gap-y-2 md:border-t">
          <div className="absolute left-full top-0 hidden flex-col pl-4 pt-2 md:flex">
            <ActionButtons vertical />
          </div>
          <TrackList />
        </div>
      </div>
      <div className="border-muted flex w-full justify-end border-t p-4 tracking-tight">
        <Link href={"https://github.com/lzldev"}>
          <span>
            @<span className="font-bold">lzldev</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
