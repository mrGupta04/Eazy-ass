import { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_USERS } from '../data/mockData'

const AuthContext = createContext(null)

const STORAGE_KEY = 'eazy-ass-auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return MOCK_USERS.find(u => u.id === parsed.id) || null
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: user.id }))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = (userId) => {
    const found = MOCK_USERS.find(u => u.id === userId)
    if (found) {
      setUser(found)
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
