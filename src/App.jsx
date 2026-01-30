import { useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'
import drones from './data/drones'
import { getMarkerColor } from './utils/droneHelpers'
import DronePopup from './components/DronePopup'
import DroneCard from './components/DroneCard'

function App() {
  const [viewState, setViewState] = useState({
    longitude: -0.1276,
    latitude: 51.5074,
    zoom: 12
  })

  const [selectedDrone, setSelectedDrone] = useState(null)
  const [hoveredDrone, setHoveredDrone] = useState(null)

  const handleDroneSelect = (droneId) => {
    setSelectedDrone(droneId)
  }

  const handleDroneDeselect = () => {
    setSelectedDrone(null)
  }

  return (
    <>
      <div className="map-container">
        <Map
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
                className={`marker ${drone.id === selectedDrone ? 'selected' : ''}`}
                style={{ backgroundColor: getMarkerColor(drone) }}
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
          
          {hoveredDrone && (
            <Popup
              longitude={hoveredDrone.coordinates.lng}
              latitude={hoveredDrone.coordinates.lat}
              closeButton={false}
              closeOnClick={false}
              anchor="bottom"
              offset={20}
            >
              <DronePopup drone={hoveredDrone} />
            </Popup>
          )}
        </Map>
      </div>

      <DroneCard 
        drone={drones.find(d => d.id === selectedDrone)} 
        onClose={handleDroneDeselect}
      />
    </>
  )
}

export default App
