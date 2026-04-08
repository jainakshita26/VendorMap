// src/core/utils/location.js

/*
  getCurrentCoordinates:
  Uses browser's built-in GPS API (navigator.geolocation)
  This talks to satellites directly — works everywhere
  including villages, no internet needed for GPS itself
*/
export const getCurrentCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        coordinates: [
          pos.coords.longitude, // longitude first (GeoJSON standard)
          pos.coords.latitude
        ],
      }),
      () => reject(new Error("Location permission denied")),
      { timeout: 5000 }
    );
  });
};

/*
  geocodeAddress:
  Converts a city name (text) → GPS coordinates
  Uses OpenStreetMap Nominatim — completely FREE
  No API key needed
  
  Example:
  "Indore, MP" → [75.85, 22.71]
  "Kota, Rajasthan" → [75.14, 25.18]
  "Small Village, Rajasthan" → might return null if not found
*/
export const geocodeAddress = async (address) => {
  try {
    // encode special characters in address for URL
    const encoded = encodeURIComponent(address);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search` +
      `?q=${encoded}` +
      `&format=json` +
      `&limit=1` +           // only need top result
      `&countrycodes=in`,    // restrict to India
      {
        headers: {
          /*
            Nominatim requires a User-Agent header
            Otherwise it may block the request
          */
          "Accept-Language": "en",
          "User-Agent": "VendorMap/1.0"
        }
      }
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        coordinates: [
          parseFloat(data[0].lon), // longitude
          parseFloat(data[0].lat), // latitude
        ],
        displayName: data[0].display_name
      };
    }

    // address not found in OpenStreetMap
    return null;

  } catch {
    // network error or API down
    return null;
  }
};

/*
  buildLocation:
  Simple helper that creates the GeoJSON object
  MongoDB needs this exact format for geospatial queries
  
  Example output:
  {
    type: "Point",
    coordinates: [75.85, 22.71],
    address: "Indore, MP"
  }
*/
export const buildLocation = (coordinates, address) => ({
  type: "Point",
  coordinates,
  address,
});

/*
  getDistanceKm:
  Calculates real-world distance between two GPS points
  Uses Haversine formula — accounts for Earth's curvature
  
  Example:
  getDistanceKm(22.71, 75.85, 25.18, 75.14) → "272.3" km
*/
export const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
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