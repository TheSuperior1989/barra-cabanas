'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRequireAuth } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export default function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const { user, loading, hasAccess, isAuthenticated } = useRequireAuth(requiredRoles)
  const router = useRouter()

  // TEMPORARY BYPASS FOR DEVELOPMENT - REMOVE IN PRODUCTION
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  useEffect(() => {
    if (isDevelopment) {
      // Skip authentication in development
      console.log('🔓 Development mode: Bypassing authentication')
      return
    }
    
    if (!loading && !isAuthenticated) {
      console.log('🚫 User not authenticated, redirecting to login')
      router.push('/login')
    } else if (!loading && isAuthenticated && !hasAccess) {
      console.log('🚫 User lacks required permissions')
      router.push('/unauthorized')
    }
  }, [loading, isAuthenticated, hasAccess, router, isDevelopment])

  // In development, always allow access
  if (isDevelopment) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
          <p className="mt-2 text-sm text-gray-500">
            {user ? `Welcome back, ${user.firstName}` : 'Checking credentials...'}
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !hasAccess) {
    return null // Will redirect
  }

  return <>{children}</>
}
