'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import dynamicImport from 'next/dynamic'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Dynamically import map components with no SSR
const MapContainer = dynamicImport(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false })
const TileLayer = dynamicImport(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })), { ssr: false })
const Marker = dynamicImport(() => import('react-leaflet').then(mod => ({ default: mod.Marker })), { ssr: false })
const Popup = dynamicImport(() => import('react-leaflet').then(mod => ({ default: mod.Popup })), { ssr: false })

// Map center component to handle map updates
function MapCenter({ center }: { center: [number, number] }) {
  useEffect(() => {
    // We'll handle map center updates differently
  }, [center])
  return null
}

export default function HospitalsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.9902, 73.3120])

  // Hospital data with coordinates for Ratnagiri, Maharashtra
  const hospitalData = {
    46: {
      id: 46,
      name: "Ratnagiri District Hospital",
      address: "Station Road, Ratnagiri, Maharashtra",
      phone: "02352 222-4567",
      rating: "4.6/5",
      services: ["Emergency Care", "Surgery Facilities", "Trauma Center", "Pediatrics", "Cardiology", "Radiology"],
      position: [16.9902, 73.3120] as [number, number]
    },
    47: {
      id: 47,
      name: "Sai Hospital",
      address: "Ganpatipule Road, Ratnagiri, Maharashtra",
      phone: "02352 967-6543",
      rating: "4.5/5",
      services: ["Consulting", "Maternity Care", "Women's Health", "Orthopedics", "Laboratory Services"],
      position: [16.9850, 73.3080] as [number, number]
    },
    48: {
      id: 48,
      name: "Ratnagiri Medical Center",
      address: "Marine Drive, Ratnagiri, Maharashtra",
      phone: "02352 466-7090",
      rating: "4.7/5",
      services: ["Therapy Services", "Health Evaluation", "Rehabilitation", "Nutrition Counseling", "Pain Management"],
      position: [16.9950, 73.3150] as [number, number]
    },
    49: {
      id: 49,
      name: "Konkan Health Care",
      address: "Pune-Mumbai Highway, Ratnagiri, Maharashtra",
      phone: "02352 224-5678",
      rating: "4.3/5",
      services: ["Community Health", "Geriatrics", "Chronic Disease Management", "Nutrition", "Wellness Programs"],
      position: [16.9850, 73.3200] as [number, number]
    },
    50: {
      id: 50,
      name: "Ratnagiri City Hospital",
      address: "Market Area, Ratnagiri, Maharashtra",
      phone: "02352 876-5432",
      rating: "4.8/5",
      services: ["Psychiatry", "Physical Therapy", "Mental Health Services", "Neurology", "Sleep Center"],
      position: [16.9950, 73.3050] as [number, number]
    }
  }

  const handleHospitalClick = (hospitalId: string) => {
    const hospital = hospitalData[parseInt(hospitalId) as keyof typeof hospitalData]
    if (hospital) {
      setSelectedHospital(hospital)
      setShowInfoPanel(true)
      setMapCenter(hospital.position)
    }
  }

  const closeInfoPanel = () => {
    setShowInfoPanel(false)
  }

  const performSearch = () => {
    if (!searchTerm.trim()) return

    for (const [id, hospital] of Object.entries(hospitalData)) {
      if (hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))) {
        handleHospitalClick(id)
        return
      }
    }
    
    alert('No hospitals found matching your search. Please try again.')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    
    // Force map refresh after a short delay to fix rendering issues
    setTimeout(() => {
      const mapElement = document.querySelector('.leaflet-container')
      if (mapElement) {
        const map = (mapElement as any)._leaflet_map
        if (map) {
          map.invalidateSize()
        }
      }
    }, 100)
  }

  const highlightCard = (id: string) => {
    document.querySelectorAll('.hospital-card').forEach(card => {
      card.classList.remove('active')
      if (card.getAttribute('data-id') === id) {
        card.classList.add('active')
        card.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }



  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8'}`}>
      <div className={`${isFullscreen ? 'h-full flex flex-col' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {/* Header */}
        <div className={`${isFullscreen ? 'flex-shrink-0 p-4 bg-white border-b' : 'text-center mb-8'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h1 className={`font-bold text-gray-900 ${isFullscreen ? 'text-2xl' : 'text-4xl'}`}>
                Find Hospitals Near You
              </h1>
            </div>
            
            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isFullscreen ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Fullscreen
                </>
              )}
            </button>
          </div>
          
          {!isFullscreen && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Browse our network of healthcare providers and find the best facility for your needs
            </p>
          )}
          
          {/* Search Bar */}
          <div className={`${isFullscreen ? 'mt-4' : 'max-w-2xl mx-auto'}`}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search hospitals, services, or locations..."
                className="w-full px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              />
              <button
                onClick={performSearch}
                className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className={`${isFullscreen ? 'flex-1 flex' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}`}>
          {/* Map Placeholder */}
          <div className={`${isFullscreen ? 'flex-1' : 'lg:col-span-2'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                                 Medical Centers in Ratnagiri
              </h2>
              
                             <div className={`relative rounded-xl overflow-hidden border-2 border-gray-200 ${isFullscreen ? 'h-full' : 'h-[500px]'}`}>
                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  className="w-full h-full"
                  style={{ height: '100%', width: '100%' }}
                >
                   <TileLayer
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                   />
                   
                                       {/* Hospital Markers */}
                    {Object.entries(hospitalData).map(([id, hospital]) => (
                      <Marker 
                        key={id}
                        position={hospital.position}
                        eventHandlers={{
                          click: () => {
                            handleHospitalClick(id)
                            highlightCard(id)
                          }
                        }}
                      >
                       <Popup>
                         <div className="text-center">
                           <h3 className="font-bold text-lg">{hospital.name}</h3>
                           <p className="text-sm text-gray-600">{hospital.address}</p>
                           <p className="text-sm text-green-600 font-semibold">Rating: {hospital.rating}</p>
                         </div>
                       </Popup>
                     </Marker>
                   ))}
                   
                                      <MapCenter center={mapCenter} />
                 </MapContainer>
                 
                 {/* Map Attribution */}
                 <div className="mt-4 text-center">
                   <div className="bg-gray-100 px-4 py-2 rounded-lg inline-block">
                     <span className="text-sm text-gray-600">
                       Map data © <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenStreetMap</a> contributors
                     </span>
                   </div>
                 </div>
                 
                 {/* Hospital Info Panel */}
                {showInfoPanel && selectedHospital && (
                  <div className="absolute bottom-6 left-6 right-6 bg-white border border-gray-200 rounded-xl p-6 shadow-lg z-[1000]">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-blue-700">{selectedHospital.name}</h3>
                      <button
                        onClick={closeInfoPanel}
                        className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{selectedHospital.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{selectedHospital.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {selectedHospital.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Services Offered</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.services.map((service: string, idx: number) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          // Store selected hospital in localStorage for appointment page
                          localStorage.setItem('selectedHospital', JSON.stringify(selectedHospital))
                          window.location.href = '/appointments'
                        }}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Get Appointment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hospital List */}
          <div className={`${isFullscreen ? 'w-80 flex-shrink-0' : ''} space-y-4 max-h-[650px] overflow-y-auto`}>
            {Object.entries(hospitalData).map(([id, hospital]) => (
              <div
                key={id}
                className={`hospital-card bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border-l-4 ${
                  selectedHospital?.name === hospital.name 
                    ? 'border-green-500 bg-blue-50 active' 
                    : 'border-blue-500 hover:border-green-500'
                }`}
                                 data-id={id}
                 onClick={() => {
                   handleHospitalClick(id)
                   highlightCard(id)
                 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg text-blue-700">{hospital.name}</h3>
                  <div className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    <span className="text-yellow-300 mr-1">★</span>
                    {hospital.rating}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{hospital.phone}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-1">
                    {hospital.services.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                    {hospital.services.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{hospital.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="mt-12 text-center">
            <div className="flex justify-center gap-6 mb-4">
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Hospital Listings
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Privacy Policy
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Terms of Service
              </a>
            </div>
            <p className="text-gray-600">© 2023 Hospital Finder. All rights reserved. Providing healthcare access since 2015</p>
          </div>
        )}
      </div>
    </div>
  )
} 