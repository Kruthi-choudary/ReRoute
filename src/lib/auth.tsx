import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  session: AuthUser | null;
  user: AuthUser | null;
  loading: boolean;
  setSession: (token: string, user: AuthUser) => void;
  signOut: () => void;
}

const TOKEN_KEY = "reroute_token";
const USER_KEY = "reroute_user";
const REDIRECT_KEY = "reroute:redirect-after-login";

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  setSession: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (token && raw) {
      try {
        setUser(JSON.parse(raw) as AuthUser);
      } catch {}
    }
    setLoading(false);
  }, []);

  function setSession(token: string, u: AuthUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ session: user, user, loading, setSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export function rememberRedirect(path: string) {
  if (typeof window !== "undefined" && path.startsWith("/")) {
    sessionStorage.setItem(REDIRECT_KEY, path);
  }
}

export function takeRedirect(): string {
  if (typeof window === "undefined") return "/dashboard";
  const v = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  return v && v.startsWith("/") ? v : "/dashboard";
}
