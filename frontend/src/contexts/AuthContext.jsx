import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as api from '../api';

/**
 * @typedef {{
 *   user: any,
 *   loading: boolean,
 *   error: string | null,
 *   isAuthenticated: boolean,
 *   login: (email: string, password: string) => Promise<any>,
 *   logout: () => void,
 *   refreshMe: () => Promise<void>,
 *   setError: import('react').Dispatch<import('react').SetStateAction<string | null>>,
 * }} AuthContextValue
 */

/** @type {import('react').Context<AuthContextValue | null>} */
const AuthContext = createContext(/** @type {AuthContextValue | null} */ (null));

const TOKEN_KEY = 'elite_admin_token';

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  const login = useCallback(async (/** @type {string} */ email, /** @type {string} */ password) => {
    setError(null);
    try {
      const { token, admin } = await api.login({ email, password });
      api.setAuthToken(token);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(admin);
      return admin;
    } catch (err) {
      const e = /** @type {{ data?: { error?: string }, message?: string }} */ (err);
      const message = e?.data?.error || e?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    api.clearAuthToken();
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setError(null);
  }, []);

  const refreshMe = useCallback(async () => {
    const token = api.getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.getMe();
      setUser(me);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      api.setAuthToken(stored);
      refreshMe();
    } else {
      setLoading(false);
    }
  }, [refreshMe]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refreshMe,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
