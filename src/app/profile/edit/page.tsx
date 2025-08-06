'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    address: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        address: user.address || ''
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update the user context with new data
      if (user) {
        login({
          ...user,
          ...formData,
          dob: formData.dob ? new Date(formData.dob).toISOString() : null
        })
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Access Denied</h2>
          <p className="mb-6">Please sign in to edit your profile</p>
          <div className="flex justify-center gap-4">
            <a
              href="/login"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Edit Profile</h1>
                <p className="text-blue-100">Update your personal information</p>
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Address</label>
                <textarea
                  name="address"
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 