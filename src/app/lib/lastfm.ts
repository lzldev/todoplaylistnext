import { env } from "~/env";
import { encode } from "querystring";

const defaults = `?${encode({
  api_key: env.LASTFM_KEY,
  format: "json",
})}&`;

export const LASTFM_API_TrackQueryURL = (track: string, page: number) =>
  `https://ws.audioscrobbler.com/2.0/${defaults}${encode({ method: "track.search", track, page, limit: 10 })}`;

export const LASTFM_API_GetUserInfo = (user: string) =>
  `https://ws.audioscrobbler.com/2.0/${defaults}${encode({ method: "user.getinfo", user })}`;

export const LASTFM_API_GetRecentTracks = (
  user: string,
  untilTimeUtc: number,
) =>
  `https://ws.audioscrobbler.com/2.0/${defaults}${encode({ method: "user.getrecenttracks", user, to: untilTimeUtc })}`;
