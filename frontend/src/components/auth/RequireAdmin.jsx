import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card } from '../ui/Card'

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function RequireAdmin({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return <Card className="h-48 animate-pulse bg-slate-100">{children ?? null}</Card>
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(loc.pathname + (loc.search || ''))
    return <Navigate to={`/admin/login?next=${next}`} replace />
  }

  return children
}

