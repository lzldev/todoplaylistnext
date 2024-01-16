import type { LASTFM_Track } from "../../server/lib/validators";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { SuperJSONStorage } from "../lib/zustand";

export type TodoTrack = LASTFM_Track & {
  created_at: Date;
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
  devtools(
    persist(
      (set) => ({
        tracks: [],
        lastSync: null,
        addTrack: (track: LASTFM_Track) =>
          set((state) => ({
            tracks: [
              { ...track, created_at: new Date(), scrobbled_at: null },
              ...state.tracks,
            ],
          })),
        set,
      }),
      {
        name: "TrackStore",
        partialize: (s) => ({
          tracks: s.tracks,
          lastSync: s.lastSync,
        }),
        storage: SuperJSONStorage,
      },
    ),
  ),
);

export { useTrackStore };
