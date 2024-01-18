"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { spt_simplified_playlist } from "~/server/lib/spotify";

export const Playlists = (props: { playlists: spt_simplified_playlist[] }) => {
  const search = useSearchParams();

  return (
    <div className="flex flex-col gap-y-2">
      {props.playlists.map((item, idx) => (
        <div key={idx} className="flex gap-x-4">
          {!item.images?.at(0) && (
            <div className="flex size-16 items-center justify-center bg-muted text-6xl">
              ?
            </div>
          )}
          {item.images?.at(0)?.url && (
            <Image
              className="size-16"
              src={item.images?.at(0)?.url}
              width={item.images?.at(0)?.width ?? 100}
              height={item.images?.at(0)?.height ?? 100}
              alt={"Playlist Cover"}
            />
          )}
          <Link href={`./sync/${item.id}`}>
            <div className="flex flex-grow items-center text-start align-middle text-xl">
              {item.name}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
