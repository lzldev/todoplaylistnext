import type { LASTFM_Track } from "../lib/validators";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TodoTrack = LASTFM_Track & {
  create_at: Date;
  scrobbled_at: Date | null;
};

export interface TrackStore {
  tracks: TodoTrack[];
  lastSync: Date | null;
  addTrack: (track: LASTFM_Track) => void;
  //TODO:?
  set: (
    partial:
      | TrackStore
      | Partial<TrackStore>
      | ((state: TrackStore) => TrackStore | Partial<TrackStore>),
    replace?: boolean | undefined,
  ) => void;
}

const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      tracks: [],
      lastSync: null,
      addTrack: (track: LASTFM_Track) =>
        set((state) => ({
          tracks: [
            { ...track, create_at: new Date(), scrobbled_at: null },
            ...state.tracks,
          ],
        })),
      set,
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
