import type { LASTFM_Track } from "../../server/lib/validators";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { SuperJSONStorage } from "../lib/zustand";
import { toast } from "sonner";

export type TodoTrack = LASTFM_Track & {
  created_at: Date;
  scrobbled_at: Date | null;
};

export interface TrackStore {
  tracks: TodoTrack[];
  lastSync: Date | null;
  addTrack: (track: LASTFM_Track) => void;
  scrobbleTrack: (idx: number) => void;
  clearTrack: (idx: number) => void;
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
      (set, get) => ({
        tracks: [],
        lastSync: null,
        addTrack: (track: LASTFM_Track) =>
          set((state) => ({
            tracks: [
              { ...track, created_at: new Date(), scrobbled_at: null },
              ...state.tracks,
            ],
          })),
        clearTrack: (idx) => {
          const t = get().tracks;
          t.splice(idx, 1);
          set({ tracks: t });
        },
        scrobbleTrack: (idx) => {
          const t = get().tracks;
          const t2 = t.at(idx);
          if (!t2) {
            toast.error("error trying to scrobble the track");
            return;
          }

          t2.scrobbled_at = new Date();

          set({ tracks: t });
        },
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
