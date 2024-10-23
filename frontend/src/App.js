import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import CarForm from './components/CarForm';  // Importing the CarForm component

function App() {
  // State to hold the calculated distance
  const [distance, setDistance] = useState(null)
  const [gasPrice, setGasPrice] = useState(null)
  const [fuelConsumption, setFuelConsumption] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  //const [formValues, setFormValues] = useState({})

  // Dummy data for user and restaurant locations
  //const userLocation = { lat: '45.4215', lng: '-75.6972' }; // Example user location
  const restaurantLocation = { lat: '45.287798', lng: '-75.672958' } // Example restaurant location

  const getUserLocation = async() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    
    function successFunction(position) {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      console.log(position);
      setUserLocation({latitude, longitude})
    }
    
    function errorFunction() {
      console.log("Unable to retrieve your location.");
    }
  }

  // Function to handle distance calculation
  const handleGetDistance = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/get_distance', {
        user_location: `${userLocation.latitude},${userLocation.longitude}`,
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
        <button onClick = {getUserLocation}>Get my location</button>
        <button onClick= {handleGetDistance}>Calculate Distance</button>
        <button onClick = {fetchGasPrice}>Get Gas Price</button>
        <CarForm
          formValues = {formValues}
          handleChange={handleChange}
          handleFuelConsumption={handleFuelConsumption}
        ></CarForm>
        {userLocation && <p>My Location: {userLocation.latitude} {userLocation.longitude}</p>}
        {distance && <p>Distance: {distance} km</p>}
        {gasPrice && <p>Gas Price: {gasPrice} </p>}
        {fuelConsumption && <p>Fuel Consumption: {fuelConsumption}</p>}
      </header>
      
    </div>
  )
}

export default App;
