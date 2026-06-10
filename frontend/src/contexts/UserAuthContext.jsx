import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as api from '../api'

const UserAuthContext = createContext(null)

const TOKEN_KEY = 'elite_user_token'

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const register = useCallback(async ({ name, companyName, registeredNumber, website, email, password }) => {
    setError(null)
    try {
      const { token, user } = await api.userRegister({
        name,
        companyName,
        registeredNumber,
        website,
        email,
        password,
      })
      api.setUserAuthToken(token)
      localStorage.setItem(TOKEN_KEY, token)
      setUser(user)
      return user
    } catch (err) {
      const message = err?.data?.error || err?.message || 'Register failed'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const { token, user } = await api.userLogin({ email, password })
      api.setUserAuthToken(token)
      localStorage.setItem(TOKEN_KEY, token)
      setUser(user)
      return user
    } catch (err) {
      const message = err?.data?.error || err?.message || 'Login failed'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const logout = useCallback(() => {
    api.clearUserAuthToken()
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setError(null)
  }, [])

  const refreshMe = useCallback(async () => {
    const token = api.getUserAuthToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await api.userMe()
      setUser(me)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (stored) {
      api.setUserAuthToken(stored)
      refreshMe()
    } else {
      setLoading(false)
    }
  }, [refreshMe])

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refreshMe,
    setError,
  }

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext)
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider')
  return ctx
}

