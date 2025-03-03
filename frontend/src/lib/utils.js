import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Calculate the driving distance between two locations.
 *
 * @param {string} start - Starting location (e.g., "45.123,-75.456" or an address).
 * @param {string} end - Destination location (e.g., a full address).
 * @returns {Promise<number>} The driving distance in kilometers.
 */
export async function calculateDistance(start, end) {
  const response = await axios.post(`${BACKEND_URL}/get_distance`, {
    start_location: start,
    destination_location: end,
  });
  // Return the distance (in km) from the response data.
  return response.data.distance_km;
}

/**
 * Fetch the live gas price based on the provided location.
 *
 * @param {object} location - An object containing 'latitude' and 'longitude'.
 * @returns {Promise<number>} The gas price (converted to a number).
 */
export async function getLiveGasPrice(location) {
  const { data } = await axios.post(`${BACKEND_URL}/get_gas_price`, {
    latitude: location.latitude,
    longitude: location.longitude,
  });

  return Number(data.gas_price);
}

/**
 * Convert the user's location object into a string
 * (either "latitude,longitude" or the typed address).
 *
 * @param {object} startLocation - The user's location object.
 * @returns {string} The formatted location string.
 */
export function getUserLocationString(startLocation) {
  if (startLocation.description) {
    // The user typed a custom address
    return startLocation.description;
  }
  // Otherwise, use lat/lon from geolocation
  return `${startLocation.latitude},${startLocation.longitude}`;
}
