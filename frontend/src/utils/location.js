export async function calculateDistance(start, end) {
  const response = await axios.post(`${BACKEND_URL}/get_distance`, {
    user_location: start,
    restaurant_location: end,
  });

  return response.data.distance_km;
}
