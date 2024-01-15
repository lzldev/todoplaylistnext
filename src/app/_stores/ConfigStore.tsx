import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TrackStore {
  username: string;
}

const useConfigStore = create<TrackStore>()(
  persist(
    (set) => ({
      username: "",
    }),
    {
      name: "TrackStore",
      partialize: (s) => ({
        username: s.username,
      }),
    },
  ),
);

export { useConfigStore };
