/**
 * Get marker color based on drone battery level and status
 * Priority: Low battery > delivering > standby
 * @param {Object} drone - Drone object
 * @returns {string} Hex color code
 */
export function getMarkerColor(drone) {
  // Battery < 25% gets orange, regardless of status
  if (drone.battery < 25) {
    return '#FF9F3D'; // Orange
  }
  
  // Status 'delivering' gets blue
  if (drone.status === 'delivering') {
    return '#3DA9FF'; // Blue
  }
  
  // Status 'standby' gets green
  return '#10B981'; // Green
}
