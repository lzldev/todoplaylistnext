import { z } from "zod";

export const spt_image = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
});

export const spt_simplified_playlist = z.object({
  collaborative: z.boolean(),
  description: z.string(),
  external_url: z.any(),
  //   external_urls: z.object({
  //     spotify: z.string(),
  //   }),
  href: z.string(),
  id: z.string(),
  images: z.any(),
  //   images: z.array(spt_image),
  name: z.string(),
  //   owner: z.object({
  //     external_urls: z.object({
  //       spotify: z.string(),
  //     }),
  //     href: z.string(),
  //     id: z.string(),
  //     type: z.string(),
  //     uri: z.string(),
  //     display_name: z.string(),
  //   }),
  public: z.boolean(),
  snapshot_id: z.string(),
  tracks: z.object({
    href: z.string(),
    total: z.number(),
  }),
  type: z.string(),
  uri: z.string(),
});

export const spt_current_user_playlist_response_parser = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(spt_simplified_playlist),
});

export const spt_track = z.object({
  album: z.any(),
  artists: z.array(z.any()),
  available_markets: z.array(z.string()),
  disc_number: z.number(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_ids: z.object({
    isrc: z.string().optional(),
    ean: z.string().optional(),
    upc: z.string().optional(),
  }),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  id: z.string(),
  is_playable: z.boolean().optional(),
  linked_from: z.any(),
  restrictions: z
    .object({
      reason: z.string(),
    })
    .optional(),
  name: z.string(),
  popularity: z.number(),
  preview_url: z.string().nullable(),
  track_number: z.number(),
  type: z.literal("track"),
  uri: z.string(),
  is_local: z.boolean(),
});

export const spt_playlist_track = z.object({
  added_at: z.string(),
  added_by: z.any(),
  //   added_by: z.object({
  //     external_urls: z.object({
  //       spotify: z.string(),
  //     }),
  //     followers: z.object({
  //       href: z.string(),
  //       total: z.number(),
  //     }),
  //     href: z.string(),
  //     id: z.string(),
  //     type: z.string(),
  //     uri: z.string(),
  //   }),
  is_local: z.boolean(),
  track: spt_track,
});

export const spt_get_playlist_items_response_parser = z.object({
  href: z.string(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  limit: z.number(),
  offset: z.number(),
  total: z.number(),
  items: z.array(spt_playlist_track),
});

export const spt_get_playlist_details_response_parser = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(spt_image),
  type: z.string(),
  uri: z.string(),
});

export const spt_get_recent_tracks_response_parser = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  total: z.number().optional(),
  cursors: z
    .object({
      after: z.string(),
      before: z.string(),
    })
    .nullable(),
  items: z.array(
    z.object({
      played_at: z.string().transform((s) => new Date(s)),
      track: z.object({
        id: z.string(),
        uri: z.string(),
        name: z.string(),
      }),
      //   added_by: z.object({
      //     external_urls: z.object({
      //       spotify: z.string(),
      //     }),
      //     followers: z.object({
      //       href: z.string(),
      //       total: z.number(),
      //     }),
      //     href: z.string(),
      //     id: z.string(),
      //     type: z.string(),
      //     uri: z.string(),
      //   }),
    }),
  ),
});
export type spt_track = z.infer<typeof spt_track>;
export type spt_simplified_playlist = z.infer<typeof spt_simplified_playlist>;
export type spt_image = z.infer<typeof spt_image>;

export type spt_get_playlist_details_reponse = z.infer<
  typeof spt_get_playlist_details_response_parser
>;

export type spt_current_user_playlist_response = z.infer<
  typeof spt_current_user_playlist_response_parser
>;
export type spt_get_playlist_items_response = z.infer<
  typeof spt_get_playlist_items_response_parser
>;

export type spt_get_recent_tracks_response = z.infer<
  typeof spt_get_recent_tracks_response_parser
>;
