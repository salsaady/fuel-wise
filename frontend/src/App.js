import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import CarForm from './components/CarForm';  // Importing the CarForm component
import LocationForm from './components/LocationForm'
import GasPriceForm from './components/GasPriceForm'

function App() {
  const [distance, setDistance] = useState(null)
  const [gasPrice, setGasPrice] = useState(null)
  const [fuelConsumption, setFuelConsumption] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [restaurantLocation, setRestaurantLocation] = useState(null)
  const [postalCode, setPostalCode] = useState(null)
  const [carFormValues, setCarFormValues] = useState({})
  const [locationFormValues, setLocationFormValues] = useState({})
  const [gasPriceFormValues, setGasPriceFormValues] = useState({})
  const [costToDrive, setCostToDrive] = useState(null)
  const [startLocation, setStartLocation] = useState(null)

  const handleCarFormChange = (e) => {
    setCarFormValues({ ...carFormValues, [e.target.id]: e.target.value })
  }
  const handleLocationFormChange = (e) => {
    setLocationFormValues({ ...locationFormValues, [e.target.id]: e.target.value })
  }

  const handleGasPriceFormChange = (e) => {
    setGasPriceFormValues({ ...gasPriceFormValues, [e.target.id]: Number(e.target.value) })
  }
  // Dummy data for user and restaurant locations
  //const userLocation = { lat: '45.4215', lng: '-75.6972' }
  //const restaurantLocation = { lat: '45.287798', lng: '-75.672958' }
 
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(position)
          setUserLocation({ latitude, longitude });
          setLocationFormValues({ ...locationFormValues, start: "Your location"});
        },
        (error) => {
          console.error("Unable to retrieve your location.", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  // Function to handle distance calculation
  const handleGetDistance = async (e) => {
    e.preventDefault()

    let startLocation = locationFormValues.start
    if (startLocation=='Your location'){
      startLocation = `${userLocation.latitude},${userLocation.longitude}`
    }
    console.log('starting location is: ', startLocation)

    try {
      const response = await axios.post('http://127.0.0.1:5000/get_distance', {
        user_location: startLocation,
        restaurant_location: locationFormValues.restaurant
      })
      await handleGetPostalCode();

      console.log(restaurantLocation)
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
  const enterGasPrice = async (e) => {
    e.preventDefault();
    const manualGasPrice = Number(gasPriceFormValues.gas);  // Ensure the value is a number
    setGasPrice(manualGasPrice);

}


  const fetchGasPrice = async() => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_gas_price');
      setGasPrice(response.data.gas_price);
      console.log(gasPrice)
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
      })
      // Set the fuel consumption from the response
      setFuelConsumption(response.data.fuel_consumption)
    } catch (error) {
      console.error("Error getting fuel consumption:", error)
    }
  }
    
const calculateCost = async(e)=>{
  e.preventDefault()
  try {
    const response = await axios.post('http://127.0.0.1:5000/calculate_cost', {
      distance: distance,
      gasPrice: gasPrice,
      fuelConsumption: fuelConsumption,
    })
    // Set the fuel consumption from the response
    setCostToDrive(response.data.cost_to_drive)
    console.log("this is the final cost",costToDrive)
  } catch (error) {
    console.error("Error getting final cost", error)
  }
}
  return (
    <div className="App">
      <header className="App-header">
        <h1>Distance Cost Calculation</h1>
        <LocationForm
          formValues = {locationFormValues}
          handleChange = {handleLocationFormChange}
          handleGetDistance = {handleGetDistance}
          getUserLocation = {getUserLocation}
        ></LocationForm>
        {distance && <p>Distance: {distance} km</p>}

        {distance && <CarForm
          formValues = {carFormValues}
          handleChange={handleCarFormChange}
          handleFuelConsumption={handleFuelConsumption}
        ></CarForm>}
        {fuelConsumption && <p>Fuel consumption (combined): {fuelConsumption} L/100km</p>}
        {fuelConsumption && <GasPriceForm
          formValues={gasPriceFormValues}
          handleChange={handleGasPriceFormChange}
          fetchGasPrice={fetchGasPrice}
          enterGasPrice={enterGasPrice}
          gasPrice={gasPrice}
        ></GasPriceForm>}
        {gasPrice && <p>Gas price: {gasPrice} c/L</p>}
        {gasPrice && <button onClick={calculateCost}>Calculate cost for trip</button>}
        {costToDrive && <p>Cost to drive (roundtrip): ${costToDrive}</p>}

      </header>
      
    </div>
  )
}

export default App
