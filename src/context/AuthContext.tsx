'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  phone: string
  dob: string | null
  address: string | null
  role: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log('AuthContext: Loaded user from localStorage:', parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    console.log('AuthContext: Logging in user:', userData)
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const logout = () => {
    console.log('AuthContext: Logging out user')
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 