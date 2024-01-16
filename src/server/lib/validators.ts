import { z } from "zod";

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
      trackmatches: z.object({
        track: z.array(LASTFM_TrackParser),
      }),
    }),
  }),
]);

export const LASTFM_UserInfoQueryResponseParser = z.union([
  z.object({
    user: LASTFM_UserParser,
  }),
  LASTFM_ErrorParser,
]);

export type LASTFM_User = z.infer<typeof LASTFM_UserParser>;
export type LASTFM_Track = z.infer<typeof LASTFM_TrackParser>;
export type LASTFM_Image = z.infer<typeof LASTFM_ImageParser>;
export type LASTFM_Error = z.infer<typeof LASTFM_ErrorParser>;

export type LASTFM_UserInfoQueryResponse = z.infer<
  typeof LASTFM_UserInfoQueryResponseParser
>;
export type LASTFM_TrackQueryResponse = z.infer<
  typeof LASTFM_TrackQueryResponseParser
>;
