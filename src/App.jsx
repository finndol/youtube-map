import { useState, useRef } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'
import drones from './data/drones'
import { getMarkerColor } from './utils/droneHelpers'
import DronePopup from './components/DronePopup'
import DroneCard from './components/DroneCard'
import FleetTable from './components/FleetTable'

const ZOOM_INCREMENT = 0.5; // Configurable zoom-in amount

function App() {
  const [viewState, setViewState] = useState({
    longitude: -0.1276,
    latitude: 51.5074,
    zoom: 12
  })

  const [selectedDrone, setSelectedDrone] = useState(null)
  const [hoveredDrone, setHoveredDrone] = useState(null)
  const [preSelectionZoom, setPreSelectionZoom] = useState(null)
  
  const mapRef = useRef(null)

  const handleDroneSelect = (droneId) => {
    const drone = drones.find(d => d.id === droneId)
    if (!drone) return

    const isFirstSelection = selectedDrone === null
    
    if (isFirstSelection) {
      // Store current zoom before zooming in
      setPreSelectionZoom(viewState.zoom)
    }

    setSelectedDrone(droneId)

    // Fly to drone - only zoom in on first selection
    if (mapRef.current) {
      const flyToOptions = {
        center: [drone.coordinates.lng, drone.coordinates.lat],
        duration: 1000,
        essential: true
      }
      
      // Only include zoom if it's the first selection
      if (isFirstSelection) {
        flyToOptions.zoom = viewState.zoom + ZOOM_INCREMENT
      }
      
      mapRef.current.flyTo(flyToOptions)
    }
  }

  const handleDroneDeselect = () => {
    // Restore original zoom level
    if (mapRef.current && preSelectionZoom !== null) {
      mapRef.current.easeTo({
        zoom: preSelectionZoom,
        duration: 800
      })
    }

    setPreSelectionZoom(null)
    setSelectedDrone(null)
  }

  const handleTableHover = (droneId) => {
    if (droneId) {
      const drone = drones.find(d => d.id === droneId)
      setHoveredDrone(drone)
    } else {
      setHoveredDrone(null)
    }
  }

  return (
    <>
      <div className="map-container">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        >
          {drones.map(drone => (
            <Marker
              key={drone.id}
              longitude={drone.coordinates.lng}
              latitude={drone.coordinates.lat}
            >
              <div 
                className={`marker ${selectedDrone === drone.id ? 'radar-effect' : ''}`}
                style={{ backgroundColor: getMarkerColor(drone), color: getMarkerColor(drone) }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDroneSelect(drone.id)
                }}
                onMouseEnter={() => setHoveredDrone(drone)}
                onMouseLeave={() => setHoveredDrone(null)}
                title={`${drone.name} - ${drone.id}`}
              />
            </Marker>
          ))}
          
          {hoveredDrone && hoveredDrone.id !== selectedDrone && (
            <Popup
              longitude={hoveredDrone.coordinates.lng}
              latitude={hoveredDrone.coordinates.lat}
              closeButton={false}
              closeOnClick={false}
              anchor="bottom"
              offset={25}
            >
              <DronePopup drone={hoveredDrone} />
            </Popup>
          )}
        </Map>
      </div>

      <FleetTable
        drones={drones}
        selectedDrone={selectedDrone}
        onDroneSelect={handleDroneSelect}
        onDroneHover={handleTableHover}
      />

      <DroneCard 
        drone={drones.find(d => d.id === selectedDrone)} 
        onClose={handleDroneDeselect}
      />
    </>
  )
}

export default App
