import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { LASTFM_API_TrackQueryURL, LASTFM_LIMIT } from "~/server/lib/lastfm";
import { LASTFM_TrackQueryResponseParser } from "~/server/lib/validators";

export const trackRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        cursor: z.number().default(1),
      }),
    )
    .query(async ({ input }) => {
      const req = await fetch(
        LASTFM_API_TrackQueryURL(input.query, input.cursor),
      ).catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const data: unknown = await req.json().catch((e) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const result = LASTFM_TrackQueryResponseParser.parse(data);

      if ("error" in result) {
        throw result;
      }

      const nextCursor =
        input.cursor * LASTFM_LIMIT > result.results["opensearch:totalResults"]
          ? null
          : input.cursor + 1;

      return {
        tracks: result.results.trackmatches.track,
        nextCursor,
      };
    }),
});
