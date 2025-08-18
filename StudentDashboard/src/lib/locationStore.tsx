import {create} from "zustand";

export interface LocationStore {
  /**
   * null       = never asked
   * true       = user is in Egypt
   * false      = user is not in Egypt
   */
  isEgyptUser: boolean | null;
  /** Call this when you know the answer */
  setIsEgyptUser: (flag: boolean) => void;
}

export const useLocationStore = create<LocationStore>((set) => {
  // Initialize from localStorage so it persists across reloads
  const raw = localStorage.getItem("isEgyptUser");
  const initial: boolean | null =
    raw === "true" ? true : raw === "false" ? false : null;

  return {
    isEgyptUser: initial,
    setIsEgyptUser: (flag: boolean) => {
      localStorage.setItem("isEgyptUser", flag ? "true" : "false");
      set({ isEgyptUser: flag });
    },
  };
});