import type { PersistStorage } from "zustand/middleware";
import superjson from "superjson";

export const SuperJSONStorage: PersistStorage<unknown> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return superjson.parse(str);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name),
};
