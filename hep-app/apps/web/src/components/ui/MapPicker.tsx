import { useEffect, useRef, useState } from 'react'

interface MapPickerProps {
  defaultLat?: number
  defaultLng?: number
  onLocationSelect: (lat: number, lng: number, address: string) => void
  className?: string
}

export function MapPicker({ defaultLat = 13.0827, defaultLng = 80.2707, onLocationSelect, className }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!).setView([defaultLat, defaultLng], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map)
      markerRef.current = marker

      const reverseGeocode = async (lat: number, lng: number) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          const data = await res.json()
          const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          setAddress(addr)
          onLocationSelect(lat, lng, addr)
        } catch {
          onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        }
      }

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        reverseGeocode(pos.lat, pos.lng)
      })

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng)
        reverseGeocode(e.latlng.lat, e.latlng.lng)
      })

      reverseGeocode(defaultLat, defaultLng)
      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className={className}>
      <div ref={containerRef} style={{ height: '280px', borderRadius: '4px' }} />
      {address && (
        <p className="text-muted-hep text-xs mt-2 truncate">📍 {address}</p>
      )}
    </div>
  )
}
