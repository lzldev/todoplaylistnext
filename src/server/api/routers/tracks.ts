import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { LASTFM_API_TrackQueryURL } from "~/server/lib/lastfm";
import { LASTFM_TrackQueryResponseParser } from "~/server/lib/validators";

export const trackRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const req = await fetch(
        LASTFM_API_TrackQueryURL(input.query, input.page),
      ).catch((e) => {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const data: unknown = await req.json().catch((e) => {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const result = LASTFM_TrackQueryResponseParser.parse(data);

      if ("error" in result) {
        throw result;
      }

      return result.results.trackmatches.track;
    }),
});
