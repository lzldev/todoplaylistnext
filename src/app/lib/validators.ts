import { z } from "zod";

export const LASTFM_ImageParser = z.object({
  size: z.string(),
  "#text": z.string(),
});

export type LASTFM_Image = z.infer<typeof LASTFM_ImageParser>;

export const LASTFM_TrackParser = z.object({
  name: z.string(),
  artist: z.string(),
  url: z.string(),
  image: z.array(LASTFM_ImageParser),
});

export type LASTFM_Track = z.infer<typeof LASTFM_TrackParser>;

export const LASTFM_TrackQueryResponseParser = z.object({
  results: z.object({
    trackmatches: z.object({
      track: z.array(LASTFM_TrackParser),
    }),
  }),
});

export type LASTFM_TrackQueryResponse = z.infer<
  typeof LASTFM_TrackQueryResponseParser
>;
