'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { FaHospital, FaStethoscope, FaDownload, FaFilePdf } from 'react-icons/fa'

interface Bill {
  id: number
  appointmentId: number | null
  patientId: number
  amount: number
  status: string
  paidAt: string | null
  createdAt: string
  appointment?: {
    date: string
    time: string
    hospital: {
      name: string
    }
    doctor?: {
      name: string
      specialization: string
    }
  }
}

export default function BillsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [bills, setBills] = useState<Bill[]>([])
  const [activeTab, setActiveTab] = useState<'medical' | 'hospital'>('medical')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchBills()
    }
  }, [user])

  const fetchBills = async () => {
    try {
      const response = await fetch(`/api/bills?patientId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setBills(data)
      }
    } catch (error) {
      console.error('Error fetching bills:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'unpaid':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const downloadBillPDF = (bill: Bill) => {
    // Create PDF content
    const pdfContent = `
      <html>
        <head>
          <title>Medical Bill - ${bill.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .bill-details { margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #2563eb; }
            .status { padding: 5px 10px; border-radius: 15px; font-size: 12px; }
            .status.paid { background: #dcfce7; color: #166534; }
            .status.unpaid { background: #fef2f2; color: #dc2626; }
            .status.pending { background: #fef3c7; color: #d97706; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HealthPlan Assistance</h1>
            <h2>Medical Bill</h2>
          </div>
          
          <div class="bill-details">
            <h3>Bill Details</h3>
            <p><strong>Bill ID:</strong> ${bill.id}</p>
            <p><strong>Date:</strong> ${formatDate(bill.createdAt)}</p>
            ${bill.appointment ? `
              <p><strong>Appointment Date:</strong> ${formatDate(bill.appointment.date)}</p>
              <p><strong>Time:</strong> ${bill.appointment.time}</p>
              <p><strong>Hospital:</strong> ${bill.appointment.hospital.name}</p>
              ${bill.appointment.doctor ? `<p><strong>Doctor:</strong> ${bill.appointment.doctor.name} (${bill.appointment.doctor.specialization})</p>` : ''}
            ` : ''}
            <p><strong>Amount:</strong> <span class="amount">₹${bill.amount}</span></p>
            <p><strong>Status:</strong> <span class="status ${bill.status.toLowerCase()}">${bill.status}</span></p>
          </div>
        </body>
      </html>
    `

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bill-${bill.id}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Authentication Required</h2>
          <p className="mb-6">You must be signed in to view your bills</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/register')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Bills</h1>
          <p className="text-xl text-gray-600">View all your medical and hospital bills</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'medical'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaStethoscope className="inline mr-2" />
              Medical Bills
            </button>
            <button
              onClick={() => setActiveTab('hospital')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'hospital'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaHospital className="inline mr-2" />
              Hospital Bills
            </button>
          </div>
        </div>

        {/* Medical Bills Tab */}
        {activeTab === 'medical' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Medical Bills</h2>
            </div>
            
            {bills.length === 0 ? (
              <div className="text-center py-12">
                <FaStethoscope className="text-gray-400 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No medical bills found</p>
                <p className="text-gray-400">Your medical bills will appear here</p>
              </div>
            ) : (
              <div className="divide-y">
                {bills.map((bill) => (
                  <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FaStethoscope className="text-blue-600" />
                          <h3 className="font-semibold text-lg">
                            {bill.appointment?.hospital.name || 'Medical Visit'}
                          </h3>
                        </div>
                        {bill.appointment ? (
                          <>
                            <p className="text-gray-600">
                              Appointment: {formatDate(bill.appointment.date)} at {bill.appointment.time}
                            </p>
                            {bill.appointment.doctor && (
                              <p className="text-gray-600">
                                Doctor: {bill.appointment.doctor.name} ({bill.appointment.doctor.specialization})
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-600">
                            Created: {formatDate(bill.createdAt)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          ₹{bill.amount}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                        <button
                          onClick={() => downloadBillPDF(bill)}
                          className="mt-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                        >
                          <FaDownload />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hospital Bills Tab */}
        {activeTab === 'hospital' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Hospital Bills</h2>
            </div>
            
            <div className="text-center py-12">
              <FaHospital className="text-gray-400 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hospital bills found</p>
              <p className="text-gray-400">Hospital billing functionality coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 