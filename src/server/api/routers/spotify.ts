import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { encode } from "querystring";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";
import {
  spt_current_user_playlist_response_parser,
  spt_get_playlist_details_response_parser,
  spt_get_playlist_items_response_parser,
  spt_get_recent_tracks_response_parser,
} from "~/server/lib/spotify";

const BEARER_TOKEN_PREFIX = `Bearer `;

const tokenParser = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string(),
});

const sptFetchWrapper = async (...args: P) => {
  const c = await fetch(...args);
  if (c.status === 401 && args[1]?.headers) {
    //TODO: Dont worry about it :3
    const auth = args[1].headers["Authorization"].slice(
      BEARER_TOKEN_PREFIX.length,
    );

    const tk = await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.access_token, auth),
    });

    if (!tk) {
      throw c;
    }

    const bd = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tk.refresh_token!,
      client_id: env.SPOTIFY_CLIENT_ID,
    });

    const reAuth = await fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET,
          ).toString("base64"),
      },
      body: bd,
    });

    if (!reAuth.ok) {
      throw reAuth;
    }

    const data: unknown = await reAuth.json();

    const t2 = tokenParser.parse(data);
    const d = Math.floor(Date.now() / 1000);

    await db
      .update(accounts)
      .set({
        expires_at: d + t2.expires_in,
        access_token: t2.access_token,
      })
      .where(eq(accounts.access_token, auth));
    const [a1, a2] = args;

    return fetch(a1, {
      ...a2,
      headers: {
        ...a2.headers,
        Authorization: BEARER_TOKEN_PREFIX + t2.access_token,
      },
    });
  }
  return c;
};

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

const spotifyUserHeaders = (access_token: string) => ({
  Authorization: `${BEARER_TOKEN_PREFIX}${access_token}`,
});

export const PLAYLISTS_PAGE_SIZE = 9;
//https://api.spotify.com/v1/me/playlists

export const spotifyRouter = createTRPCRouter({
  playlists: spotify_secureProcedure
    .input(
      z.object({
        page: z.number({ coerce: true }).default(0),
      }),
    )
    .query(async ({ input, ctx }) => {
      const request = await sptFetchWrapper(
        "https://api.spotify.com/v1/me/playlists?" +
          encode({
            limit: PLAYLISTS_PAGE_SIZE,
            offset: PLAYLISTS_PAGE_SIZE * input.page,
          }) +
          "&" +
          encode({
            fields:
              "href,limit,next,offset,previous,total,items(id,href,images,name,description)",
          }),
        {
          headers: spotifyUserHeaders(ctx.session.spotify.access_token!),
        },
      );

      if (!request.ok) {
        console.error(await request.json());
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const data: unknown = await request.json().catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const parsed = spt_current_user_playlist_response_parser.parse(data);

      return parsed;
    }),
  playlist_tracks: spotify_secureProcedure
    .input(
      z.object({
        playlist_id: z.string(),
        offset: z.number({ coerce: true }).default(0),
      }),
    )
    .query(async ({ input, ctx }) => {
      const request = await sptFetchWrapper(
        `https://api.spotify.com/v1/playlists/${input.playlist_id}/tracks?${encode({ offset: input.offset })}`,
        {
          headers: spotifyUserHeaders(ctx.session.spotify.access_token!),
        },
      );

      if (!request.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const data: unknown = await request.json().catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const parsed = spt_get_playlist_items_response_parser.parse(data);

      return parsed;
    }),
  playlist_details: spotify_secureProcedure
    .input(
      z.object({
        playlist_id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const request = await sptFetchWrapper(
        `https://api.spotify.com/v1/playlists/${input.playlist_id}?${encode({ fields: `id,name,images,snapshot_id,type,uri,tracks(total)` })}`,
        {
          headers: spotifyUserHeaders(ctx.session.spotify.access_token!),
        },
      );

      if (!request.ok) {
        console.error("error", await request.json());
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const data: unknown = await request.json().catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const parsed = spt_get_playlist_details_response_parser.parse(data);

      return parsed;
    }),

  recent_tracks: spotify_secureProcedure
    .input(
      z.object({
        before: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const uri = `https://api.spotify.com/v1/me/player/recently-played?${encode({ limit: 50 })}&${input.before ? encode({ before: input.before }) : ""}`;
      const request = await sptFetchWrapper(uri, {
        headers: spotifyUserHeaders(ctx.session.spotify.access_token!),
      }).catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      if (!request.ok) {
        console.error("error", await request.json());
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const data: unknown = await request.json().catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      const parsed = spt_get_recent_tracks_response_parser.parse(data);

      return parsed;
    }),

  delete_tracks: spotify_secureProcedure
    .input(
      z.object({
        playlist_id: z.string(),
        tracks: z.array(z.object({ uri: z.string() })),
        snapshot_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const uri = `https://api.spotify.com/v1/playlists/${input.playlist_id}/tracks`;
      const request = await sptFetchWrapper(uri, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          ...spotifyUserHeaders(ctx.session.spotify.access_token!),
        },
        body: JSON.stringify({
          tracks: input.tracks,
          snapshot_id: input.snapshot_id,
        }),
      }).catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      });

      if (!request.ok) {
        console.error("error", await request.json());
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return true;
    }),
});

type P = Parameters<typeof fetch>;
