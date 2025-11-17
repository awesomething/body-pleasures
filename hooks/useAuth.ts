import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export type User = {
  id: string
  email: string
  name: string | null
  phone?: string
  role: string
}

export function useAuth () {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      setError(null)
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Registration failed')
        }

        const data = await res.json()
        console.log('✅ Registration successful:', data.user)
        setUser(data.user)
        // Return the user data so caller can handle navigation
        return data.user
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed'
        console.error('❌ Registration error:', message)
        setError(message)
        throw err
      }
    },
    []
  )

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null)
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Login failed')
        }

        const data = await res.json()
        console.log('✅ Login successful:', data.user)
        setUser(data.user)
        // Return the user data so caller can handle navigation
        return data.user
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed'
        console.error('❌ Login error:', message)
        setError(message)
        throw err
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }, [router])

  return { user, loading, error, register, login, logout }
}
