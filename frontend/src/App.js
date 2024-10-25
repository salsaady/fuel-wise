import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import CarForm from './components/CarForm';  // Importing the CarForm component
import LocationForm from './components/LocationForm'

function App() {
  // State to hold the calculated distance
  const [distance, setDistance] = useState(null)
  const [gasPrice, setGasPrice] = useState(null)
  const [fuelConsumption, setFuelConsumption] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [postalCode, setPostalCode] = useState(null)
  const [carFormValues, setCarFormValues] = useState({});
  const [locationFormValues, setLocationFormValues] = useState({});

  const handleCarFormChange = (e) => {
    setCarFormValues({ ...carFormValues, [e.target.id]: e.target.value })
  }
  const handleLocationFormChange = (e) => {
    setLocationFormValues({ ...locationFormValues, [e.target.id]: e.target.value })
  }

  // Dummy data for user and restaurant locations
  //const userLocation = { lat: '45.4215', lng: '-75.6972' }; // Example user location
  const restaurantLocation = { lat: '45.287798', lng: '-75.672958' } // Example restaurant location
 
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserLocation({ latitude, longitude });
          setLocationFormValues({ ...locationFormValues, start: `${latitude}, ${longitude}` });
        },
        (error) => {
          console.error("Unable to retrieve your location.", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // Function to handle distance calculation
  const handleGetDistance = async (e) => {
    e.preventDefault()

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

  const handleGetPostalCode = async() => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/get_postal_code', {
        longitude: userLocation.longitude,
        latitude: userLocation.latitude
      })
      setPostalCode(response.data.postal_code)
    } catch (error) {
      console.error("Error getting postal code:", error)
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
        year: carFormValues.year,
        make: carFormValues.make,
        model: carFormValues.model
      });
      // Set the fuel consumption from the response
      setFuelConsumption(response.data.fuel_consumption)
    } catch (error) {
      console.error("Error getting fuel consumption:", error)
    }
  }
    

  return (
    <div className="App">
      <header className="App-header">
        <h1>Test Distance Calculation</h1>
        {/* <button onClick = {getUserLocation}>Get my location</button>
        <button onClick={() => { handleGetDistance(); handleGetPostalCode() }}>Calculate Distance</button>
        <button onClick = {fetchGasPrice}>Get Gas Price</button> */}
        <LocationForm
          formValues = {locationFormValues}
          handleChange = {handleLocationFormChange}
          handleGetDistance = {handleGetDistance}
          getUserLocation = {getUserLocation}
        ></LocationForm>
        <CarForm
          formValues = {carFormValues}
          handleChange={handleCarFormChange}
          handleFuelConsumption={handleFuelConsumption}
        ></CarForm>
        {userLocation && <p>My Location: {userLocation.latitude} {userLocation.longitude}</p>}
        {distance && <p>Distance: {distance} km</p>}
        {gasPrice && <p>Gas Price: {gasPrice} cents/L </p>}
        {fuelConsumption && <p>Combined Fuel Consumption: {fuelConsumption} L/100km</p>}
        {postalCode && <p>Postal Code: {postalCode}</p>}
      </header>
      
    </div>
  )
}

export default App;
