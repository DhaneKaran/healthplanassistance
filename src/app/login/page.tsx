'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Login user with context
      login(data)
      
      // Redirect to profile
      router.push('/profile')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email*</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Password*</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
} 