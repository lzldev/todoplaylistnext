import { create } from "zustand";

export interface TrackStore {
  nothing: boolean;
}

const useTrackStore = create<TrackStore>()((set, get) => ({
  nothing: true,
}));

export { useTrackStore };
