import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as api from '../api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'elite_admin_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { token, admin } = await api.login({ email, password });
      api.setAuthToken(token);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(admin);
      return admin;
    } catch (err) {
      const message = err?.data?.error || err?.message || 'Login failed';
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
