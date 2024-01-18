import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "~/app/_components/ui/components/ui/pagination";
import { Skeleton } from "~/app/_components/ui/components/ui/skeleton";
import { PLAYLISTS_PAGE_SIZE } from "~/server/api/routers/spotify";
import { api } from "~/trpc/server";

export const Playlists = async ({ pageParam }: { pageParam: string }) => {
  const page = parseInt(pageParam);
  const playlists = await api.spotify.playlists.query({ page }).catch(() => {
    return notFound();
  });

  return (
    <>
      <div className="flex flex-grow flex-col gap-y-4 p-4">
        <div className="flex flex-col">
          {playlists.items.map((item) => (
            <Link
              key={item.id}
              href={`../sync/${item.id}`}
              className="group/playlist flex gap-x-4 rounded-md p-2 outline-none focus-within:bg-muted hover:bg-muted"
            >
              {!item.images?.at(0) && (
                <div className="flex size-16 items-center justify-center bg-muted text-6xl">
                  ?
                </div>
              )}
              {item.images?.at(0)?.url && (
                <Image
                  className="size-16 object-cover"
                  src={item.images?.at(0)!.url}
                  width={item.images?.at(0)?.width ?? 100}
                  height={item.images?.at(0)?.height ?? 100}
                  alt={"Playlist Cover"}
                />
              )}
              <div className="flex flex-grow items-center overflow-hidden truncate text-start align-middle text-xl">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
        <Pagination className="flex-grow flex-row items-end justify-between">
          {playlists.previous && (
            <PaginationPrevious
              className="flex-grow justify-start"
              href={`./${page - 1}`}
            />
          )}
          {playlists.next && (
            <PaginationNext
              className="flex-grow justify-end"
              href={`./${page + 1}`}
            />
          )}
        </Pagination>
      </div>
    </>
  );
};

export const PlaylistsSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-2 p-4">
      {new Array(PLAYLISTS_PAGE_SIZE).fill(undefined).map((_, idx) => (
        <Skeleton key={idx} className="h-16" />
      ))}
      <Skeleton className="mt-auto h-8" />
    </div>
  );
};
