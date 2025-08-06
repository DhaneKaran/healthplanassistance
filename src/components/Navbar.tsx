"use client"

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return null
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                HealthPlan Assistance
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                href="/hospitals" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Hospitals
              </Link>
              <Link 
                href="/medicines" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Medicines
              </Link>
              <Link 
                href="/appointments" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Appointments
              </Link>
              <Link 
                href="/orders" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Orders
              </Link>
              <Link 
                href="/bills" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Bills
              </Link>
              <Link 
                href="/profile" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <span className="mr-4 text-gray-700 hidden md:inline">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  href="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 