import { env } from "~/env";
import { encode } from "querystring";

const defaults = `?${encode({
  api_key: env.LASTFM_KEY,
  format: "json",
})}&`;

export const LASTFM_LIMIT = 30;

export const LASTFM_API_TrackQueryURL = (track: string, page: number) =>
  `https://ws.audioscrobbler.com/2.0/${defaults}${encode({ method: "track.search", track, page })}`;

export const LASTFM_API_GetUserInfo = (user: string) =>
  `https://ws.audioscrobbler.com/2.0/${defaults}${encode({ method: "user.getinfo", user })}`;

//Max limit
export const LASTFM_RecentTracks_LIMIT = 200;
export const LASTFM_API_GetRecentTracks = (params: { user: string }) =>
  `https://ws.audioscrobbler.com/2.0/${defaults}${encode({ method: "user.getrecenttracks", user: params.user, limit: LASTFM_RecentTracks_LIMIT })}`;
