import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  LASTFM_API_GetRecentTracks,
  LASTFM_API_GetUserInfo,
} from "~/server/lib/lastfm";
import {
  LASTFM_RecentTracksQueryResponseParser,
  LASTFM_UserInfoQueryResponseParser,
} from "~/server/lib/validators";

export const userRouter = createTRPCRouter({
  check: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const req = await fetch(LASTFM_API_GetUserInfo(input.username)).catch(
        (e) => {
          console.error(e);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        },
      );

      const data: unknown = await req.json().catch((e) => {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const result = LASTFM_UserInfoQueryResponseParser.parse(data);

      if ("error" in result) {
        throw result;
      }

      return result.user;
    }),
  recentTracks: publicProcedure
    .input(
      z.object({
        username: z.string(),
        cursor: z.number().default(1),
      }),
    )
    .mutation(async ({ input }) => {
      const uri = LASTFM_API_GetRecentTracks({
        user: input.username,
      });

      const req = await fetch(uri).catch((e) => {
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

      const result = LASTFM_RecentTracksQueryResponseParser.parse(data);

      if ("error" in result) {
        throw result;
      }

      return result.recenttracks.track;
    }),
});
