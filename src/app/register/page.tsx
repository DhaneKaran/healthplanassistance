'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    address: '',
    role: 'PATIENT'
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    console.log('Form data being submitted:', formData)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Registration response:', data)

      if (!response.ok) {
        if (data.error === 'User already exists') {
          throw new Error('Account already exists. Please sign in instead.')
        }
        throw new Error(data.error || 'Registration failed')
      }

      // Login user with context
      login(data)
      
      // Redirect to profile
      router.push('/profile')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
            {error.includes('already exists') && (
              <div className="mt-2">
                <Link href="/login" className="text-blue-600 font-medium hover:underline">
                  Sign in to your account
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name*</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">User Type*</label>
            <select
              name="role"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="PHARMACIST">Pharmacist</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Email*</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Phone Number*</label>
            <input
              type="tel"
              name="phone"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <p className="text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
} 