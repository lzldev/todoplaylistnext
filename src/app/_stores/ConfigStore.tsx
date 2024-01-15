import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TrackStore {
  username: string;
  setUsername: (v: string) => void;
}

const useConfigStore = create<TrackStore>()(
  persist(
    (set) => ({
      username: "",
      setUsername: (v: string) => set({ username: v }),
    }),
    {
      name: "configstore",
      partialize: (s) => ({
        username: s.username,
      }),
    },
  ),
);

export { useConfigStore };
