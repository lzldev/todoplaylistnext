import { z } from "zod";
import { fromUnixTime } from "date-fns";

export const LASTFM_ImageParser = z.object({
  size: z.string(),
  "#text": z.string(),
});

export const LASTFM_TrackParser = z.object({
  name: z.string(),
  artist: z.string(),
  url: z.string(),
  image: z.array(LASTFM_ImageParser),
});

export const LASTFM_UserParser = z.object({
  name: z.string(),
  image: z.array(LASTFM_ImageParser),
  url: z.string(),
  // age: z.string(),
  // subscriber: z.string(),
  // realname: z.string(),
  // bootstrap: z.string(),
  // playcount: z.string(),
  // artist_count: z.string(),
  // playlists: z.string(),
  // track_count: z.string(),
  // album_count: z.string(),
  // registered: z.object({
  //   unixtime: z.string(),
  //   "#text": z.string(),
  // }),
  // gender: z.string(),
  // country: z.string(),
  // type: z.string(),
});

export const LASTFM_ErrorParser = z.object({
  error: z.number({ coerce: true }),
  message: z.string(),
});

export const LASTFM_TrackQueryResponseParser = z.union([
  LASTFM_ErrorParser,
  z.object({
    results: z.object({
      "opensearch:totalResults": z.number({
        coerce: true,
      }),
      trackmatches: z.object({
        track: z.array(LASTFM_TrackParser),
      }),
    }),
  }),
]);

const LASTFM_BaseRecentTrack = z.object({
  name: z.string(),
  url: z.string(),
});

const LASTFM_RecentTrack = LASTFM_BaseRecentTrack.and(
  z.object({
    date: z
      .object({
        uts: z.number({
          coerce: true,
        }),
        "#text": z.string(),
      })
      .transform((d) => fromUnixTime(d.uts)),
  }),
);

const LASTFM_NowPlayingTrack = LASTFM_BaseRecentTrack.and(
  z.object({
    "@attr": z.object({
      nowplaying: z.boolean({ coerce: true }),
    }),
  }),
);

export const LASTFM_RecentTracksQueryResponseParser = z.union([
  // LASTFM_UserParser
  z.object({
    recenttracks: z.object({
      track: z
        .array(z.union([LASTFM_NowPlayingTrack, LASTFM_RecentTrack]))
        .transform((arr) =>
          arr.filter(
            (track): track is LASTFM_RecentTrack => !("@attr" in track),
          ),
        ),
    }),
  }),
  LASTFM_ErrorParser,
]);

export const LASTFM_UserInfoQueryResponseParser = z.union([
  z.object({
    user: LASTFM_UserParser,
  }),
  LASTFM_ErrorParser,
]);

export type LASTFM_User = z.infer<typeof LASTFM_UserParser>;
export type LASTFM_Track = z.infer<typeof LASTFM_TrackParser>;
export type LASTFM_RecentTrack = z.infer<typeof LASTFM_RecentTrack>;
export type LASTFM_NowPlayingTrack = z.infer<typeof LASTFM_NowPlayingTrack>;

export type LASTFM_Image = z.infer<typeof LASTFM_ImageParser>;
export type LASTFM_Error = z.infer<typeof LASTFM_ErrorParser>;

export type LASTFM_UserInfoQueryResponse = z.infer<
  typeof LASTFM_UserInfoQueryResponseParser
>;
export type LASTFM_RecentTracksQueryResponse = z.infer<
  typeof LASTFM_RecentTracksQueryResponseParser
>;
export type LASTFM_TrackQueryResponse = z.infer<
  typeof LASTFM_TrackQueryResponseParser
>;
