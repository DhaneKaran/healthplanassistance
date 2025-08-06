'use client'

import { useEffect, useState } from 'react'
import hospitals from '@/data/hospitals'

export default function HospitalMap() {
  const [MapComponent, setMapComponent] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Dynamically import react-leaflet components
    import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup }) => {
      import('leaflet').then((L) => {
        // Fix for default marker icons in Next.js
        delete (L.default.Icon.Default.prototype as any)._getIconUrl
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        setMapComponent({ MapContainer, TileLayer, Marker, Popup })
      })
    })
  }, [])

  // Default position for the map (center of London)
  const defaultPosition: [number, number] = [51.505, -0.09]

  if (!isClient || !MapComponent) {
    return (
      <div className="h-[500px] w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponent

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden">
      <MapContainer 
        center={defaultPosition} 
        zoom={13} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {hospitals.map(hospital => (
          <Marker key={hospital.id} position={hospital.position}>
            <Popup className="min-w-[250px]">
              <div className="font-bold text-lg text-blue-700">{hospital.name}</div>
              <div className="mt-2">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{hospital.phone}</span>
                </div>
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {hospital.rating}/5
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-medium text-sm">Services:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {hospital.services.map((service, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 