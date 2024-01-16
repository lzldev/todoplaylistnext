import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { LASTFM_API_GetUserInfo } from "~/app/lib/lastfm";
import {
  LASTFM_ErrorParser,
  LASTFM_UserInfoQueryResponseParser,
} from "~/app/lib/validators";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

      console.log(data);

      const prs = z.union([
        LASTFM_UserInfoQueryResponseParser,
        LASTFM_ErrorParser,
      ]);

      const d2 = prs.parse(data);

      if ("error" in d2) {
        throw d2;
      }

      const result = LASTFM_UserInfoQueryResponseParser.parse(data);

      return result.user;
    }),
});
