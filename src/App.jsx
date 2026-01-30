import { useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'
import drones from './data/drones'
import { getMarkerColor } from './utils/droneHelpers'

function App() {
  const [viewState, setViewState] = useState({
    longitude: -0.1276,
    latitude: 51.5074,
    zoom: 11
  })

  return (
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
              className="marker" 
              style={{ backgroundColor: getMarkerColor(drone) }}
              title={`${drone.name} - ${drone.id}`}
            />
          </Marker>
        ))}
      </Map>
    </div>
  )
}

export default App
