import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LASTFM_User } from "../lib/validators";

export interface TrackStore {
  user: LASTFM_User | null;
  setUser: (user: LASTFM_User | null) => void;
}

const useConfigStore = create<TrackStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (v) => set({ user: v }),
    }),
    {
      name: "userStore",
      partialize: (s) => ({
        user: s.user,
      }),
    },
  ),
);

export { useConfigStore };
