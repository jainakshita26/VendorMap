

// Get coordinates from browser silently
export const getCurrentCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        coordinates: [pos.coords.longitude, pos.coords.latitude],
      }),
      () => reject(new Error("Location permission denied"))
    );
  });
};

// Build full location object to send to backend
export const buildLocation = (coordinates, address) => ({
  type: "Point",
  coordinates,  // [longitude, latitude]
  address,      // human readable string
});

// Calculate distance between two coordinates (in km)
export const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};