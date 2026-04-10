import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  login as loginService,
  ensureSuperAdmin,
  getUser,
  changeUserPassword,
} from "../services/users";
import { can as canHelper } from "../constants/permissions";

const AuthContext = createContext(null);
const SESSION_KEY = "vilajuga_session_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: ensure Gioconda exists, then restore session from storage (re-fetching to get latest permissions)
  useEffect(() => {
    let cancelled = false;

    async function init() {
      await ensureSuperAdmin();
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        try {
          const { username } = JSON.parse(stored);
          const fresh = await getUser(username);
          if (!cancelled && fresh) {
            const { passwordHash, ...safe } = fresh;
            setUser(safe);
          } else if (!cancelled) {
            sessionStorage.removeItem(SESSION_KEY);
          }
        } catch {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
      if (!cancelled) setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await loginService(username, password);
    if (!result) return { ok: false, error: "Credencials incorrectes" };
    setUser(result);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: result.username }));
    return { ok: true, user: result };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const changePassword = useCallback(
    async (newPassword) => {
      if (!user) throw new Error("No hi ha sessió activa");
      await changeUserPassword(user.username, newPassword);
      // Refresh user state to clear mustChangePassword flag
      const fresh = await getUser(user.username);
      if (fresh) {
        const { passwordHash, ...safe } = fresh;
        setUser(safe);
      }
    },
    [user]
  );

  /** Refetch the current user from Firestore (e.g. after an admin updates permissions). */
  const refreshUser = useCallback(async () => {
    if (!user) return;
    const fresh = await getUser(user.username);
    if (fresh) {
      const { passwordHash, ...safe } = fresh;
      setUser(safe);
    }
  }, [user]);

  const can = useCallback(
    (resource, action) => canHelper(user?.permissions, resource, action),
    [user]
  );

  const isAdmin = !!user;
  const mustChangePassword = !!user?.mustChangePassword;

  const value = {
    user,
    isAdmin,
    mustChangePassword,
    loading,
    login,
    logout,
    changePassword,
    refreshUser,
    can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
