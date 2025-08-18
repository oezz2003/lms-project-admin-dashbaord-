import { create } from "zustand";

// Define the store's type
interface StoreState {
  count: number;
  isEgyptUser: boolean | null;
  isLogIn: boolean | null;
  locationChecked: boolean;
  setEgyptUser: (value: boolean) => void;
  setIsLogIn: (value: boolean) => void;
  setLocationChecked: (value: boolean) => void;
}

// Helper functions for localStorage
const getStoredState = () => {
  try {
    const stored = localStorage.getItem("app-store");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveToStorage = (state: Partial<StoreState>) => {
  try {
    localStorage.setItem(
      "app-store",
      JSON.stringify({
        isEgyptUser: state.isEgyptUser,
        locationChecked: state.locationChecked,
      }),
    );
  } catch {
    // Ignore localStorage errors
  }
};

// Initialize with stored values
const storedState = getStoredState();

// Create the store
export const useStore = create<StoreState>((set) => ({
  count: 0,
  isEgyptUser: storedState.isEgyptUser ?? null,
  locationChecked: storedState.locationChecked ?? false,
  isLogIn: storedState.isLogIn ?? null,
  setEgyptUser: (value) =>
    set((state) => {
      const newState = { ...state, isEgyptUser: value };
      saveToStorage(newState);
      return newState;
    }),
    setIsLogIn: (value) =>
    set((state) => {
      const newState = { ...state, isLogIn: value };
      saveToStorage(newState);
      return newState;
    }),
  setLocationChecked: (value) =>
    set((state) => {
      const newState = { ...state, locationChecked: value };
      saveToStorage(newState);
      return newState;
    }),
}));
