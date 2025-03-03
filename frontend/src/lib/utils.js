import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export async function calculateDistance(start, end) {
  const response = await axios.post(`${BACKEND_URL}/get_distance`, {
    user_location: start,
    restaurant_location: end,
  });

  return response.data.distance_km;
}

export async function getLiveGasPrice(location) {
  const { data } = await axios.post(`${BACKEND_URL}/get_gas_price`, {
      latitude: location.latitude,
      longitude: location.longitude,
  });

  return Number(data.gas_price);
}
