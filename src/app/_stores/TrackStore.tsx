import type { LASTFM_Track } from "../lib/validators";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TrackStore {
  tracks: LASTFM_Track[];
  addTrack: (track: LASTFM_Track) => void;
}

const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      tracks: [],
      addTrack: (track: LASTFM_Track) =>
        set((state) => ({ tracks: [...state.tracks, track] })),
    }),
    {
      name: "TrackStore",
      partialize: (s) => ({
        tracks: s.tracks,
      }),
    },
  ),
);

export { useTrackStore };
