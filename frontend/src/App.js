import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State to hold the calculated distance
  const [distance, setDistance] = useState(null)
  const [gasPrice, setGasPrice] = useState(null)

  // Dummy data for user and restaurant locations
  const userLocation = { lat: '45.4215', lng: '-75.6972' }; // Example user location
  const restaurantLocation = { lat: '45.425', lng: '-75.699' }; // Example restaurant location

  // Function to handle distance calculation
  const handleGetDistance = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/get_distance', {
        user_location: `${userLocation.lat},${userLocation.lng}`,
        restaurant_location: `${restaurantLocation.lat},${restaurantLocation.lng}`
      });
      setDistance(response.data.distance_km);
    } catch (error) {
      console.error("Error getting distance:", error);
    }
  };

  const handleGetGasPrice = async() => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_gas_price');
      setGasPrice(response.data.gas_price);
    } catch (error) {
      console.error("Error getting gas price", error);
    }
    }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Test Distance Calculation</h1>

        {/* Button to calculate the distance */}
        <button onClick={handleGetDistance}>Calculate Distance</button>
        <button onClick = {handleGetGasPrice}>Get Gas Price</button>
        {/* Display the calculated distance */}
        {distance && <p>Distance: {distance} km</p>}
        {gasPrice && <p>Gas Price: {gasPrice} </p>}
      </header>
    </div>
  );
}

export default App;
