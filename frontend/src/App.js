import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import CarForm from './components/CarForm';  // Importing the CarForm component
import DisplayResults from './components/DisplayResults';  // Importing DisplayResults component


function App() {
  // State to hold the calculated distance
  const [distance, setDistance] = useState(null)
  const [gasPrice, setGasPrice] = useState(null)
  const [fuelConsumption, setFuelConsumption] = useState(null)
  //const [formValues, setFormValues] = useState({})

  // Dummy data for user and restaurant locations
  const userLocation = { lat: '45.4215', lng: '-75.6972' }; // Example user location
  const restaurantLocation = { lat: '45.425', lng: '-75.699' } // Example restaurant location

  // Function to handle distance calculation
  const handleGetDistance = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/get_distance', {
        user_location: `${userLocation.lat},${userLocation.lng}`,
        restaurant_location: `${restaurantLocation.lat},${restaurantLocation.lng}`
      });
      setDistance(response.data.distance_km);
    } catch (error) {
      console.error("Error getting distance:", error)
    }
  }

  const fetchGasPrice = async() => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_gas_price');
      setGasPrice(response.data.gas_price);
    } catch (error) {
      console.error("Error getting gas price", error)
    }
    }
  const handleFuelConsumption = async (e) => {
    e.preventDefault()
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/get_fuel_consumption', {
        year: formValues.year,
        make: formValues.make,
        model: formValues.model
      });
      // Set the fuel consumption from the response
      setFuelConsumption(response.data.fuel_consumption)
    } catch (error) {
      console.error("Error getting fuel consumption:", error)
    }
  }
    
  const [formValues, setFormValues] = useState({})
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Test Distance Calculation</h1>

        {/* Button to calculate the distance */}
        <button onClick= {handleGetDistance}>Calculate Distance</button>
        <button onClick = {fetchGasPrice}>Get Gas Price</button>
        <CarForm
          formValues = {formValues}
          handleChange={handleChange}
          handleFuelConsumption={handleFuelConsumption}
        ></CarForm>
        {/* Display the calculated distance */}
        {distance && <p>Distance: {distance} km</p>}
        {gasPrice && <p>Gas Price: {gasPrice} </p>}
        {<p>Fuel Consumption: {fuelConsumption}</p>}
      </header>
      
    </div>
  )
}

export default App;
