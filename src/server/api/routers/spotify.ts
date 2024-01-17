import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const spotify_secureProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const acc = await ctx.db.query.accounts.findFirst({
      columns: {
        access_token: true,
      },
      where: (account, { eq, and }) =>
        and(
          eq(account.userId, ctx.session.user.id),
          eq(account.provider, "spotify"),
        ),
    });

    if (!acc) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: {
          ...ctx.session,
          spotify: { access_token: acc.access_token },
        },
      },
    });
  },
);

export const spotifyRouter = createTRPCRouter({
  check: spotify_secureProcedure.mutation(async ({ input, ctx }) => {
    const request = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ctx.session.spotify.access_token}`,
        },
      },
    );

    const data: unknown = await request.json();

    return data;
  }),
});
