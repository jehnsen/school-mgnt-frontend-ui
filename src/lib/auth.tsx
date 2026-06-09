"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "@/lib/api/endpoints";
import { getAuthToken, setAuthToken, ApiError } from "@/lib/api/client";
import type { Role, User } from "@/lib/api/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session from a persisted token on first mount.
  useEffect(() => {
    const stored = getAuthToken();
    if (!stored) {
      setLoading(false);
      return;
    }
    setToken(stored);
    authApi
      .me()
      .then((u) => setUser(u))
      .catch((err) => {
        // Invalid/expired token — clear it silently.
        if (err instanceof ApiError && err.status === 401) {
          setAuthToken(null);
          setToken(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setAuthToken(res.token);
    setToken(res.token);
    const u = res.user ?? (await authApi.me().catch(() => null));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout
    }
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const u = await authApi.me().catch(() => null);
    setUser(u);
  }, []);

  const hasRole = useCallback(
    (...roles: Role[]) => (user ? roles.includes(user.role) : false),
    [user],
  );

  const value = useMemo(
    () => ({ user, token, loading, login, logout, hasRole, refresh }),
    [user, token, loading, login, logout, hasRole, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
