import { env } from "~/env";

export const LASTFM_API_TrackQueryURL = (query: string, page?: number) =>
  `https://ws.audioscrobbler.com/2.0/?method=track.search&api_key=${env.LASTFM_KEY}&page=${page ?? 0}&track="${query}"&format=json`;
