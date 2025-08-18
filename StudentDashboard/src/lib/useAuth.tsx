// src/lib/useAuth.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "./firebase";

// 1) Define the shape of our context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const noopAsync = async () => {};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: noopAsync,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // logout implementation that signs out from Firebase and clears client caches
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);

      // Best-effort cleanup of local caches (adjust keys to whatever your app uses)
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // any other keys you use:
        // localStorage.removeItem("refreshToken");
      } catch (e) {
        // ignore localStorage errors
        // console.warn("Failed clearing localStorage during logout", e);
      }

      // Set local state defensively
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4) Custom hook to consume the context (named export)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

// default export so existing default imports still work
export default useAuth;