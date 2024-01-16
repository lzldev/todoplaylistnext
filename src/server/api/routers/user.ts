import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { LASTFM_API_GetUserInfo } from "~/server/lib/lastfm";
import { LASTFM_UserInfoQueryResponseParser } from "~/server/lib/validators";

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
        untilTimeUTC: z.number(),
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
});
