import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import CarForm from "./components/CarForm"; 
import LocationForm from "./components/LocationForm";
import GasPriceForm from "./components/GasPriceForm";
import { ArrowRight } from "lucide-react";
import { useForm } from "./contexts/FormContext";
import { calculateDistance } from "./lib/utils";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {

  const { distance, gasPrice, startLocation, fuelConsumption, finalCost, setDistance, setGasPrice, setStartLocation, setFuelConsumption, setFinalCost } =
    useForm();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setStartLocation({ latitude, longitude });

          // Send user's location to the backend
          try {
            await axios.post(`${BACKEND_URL}/user_location`, {
              latitude,
              longitude,
            });
            console.log("User location sent to backend:", {
              latitude,
              longitude,
            });
          } catch (error) {
            console.error("Error sending user location to backend:", error);
          }
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Function to handle distance calculation
  const handleGetDistance = async (e) => {
    e.preventDefault();

    if (!startLocation) {
      console.error("Start location not set");
      return;
    }

    console.log("starting location is: ", startLocation);
    const destinationLocation = e.target.destination.value; 

    try {
      const distance = await calculateDistance(
        `${startLocation.latitude},${startLocation.longitude}`,
        destinationLocation
      );
      setDistance(distance);
    } catch (error) {
      console.error("Error getting distance:", error);
    }
  };

  const handleFuelConsumption = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/get_fuel_consumption`, {
        year: e.target.year.value,
        make: e.target.make.value,
        model: e.target.model.value,
      });
      // Set the fuel consumption from the response
      setFuelConsumption(response.data.fuel_consumption);
    } catch (error) {
      console.error("Error getting fuel consumption:", error);
    }
  };

  // Final cost calculation based on distance, gasPrice, and fuelConsumption
  const calculateCost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/calculate_cost`, {
        distance: distance,
        gasPrice: gasPrice,
        fuelConsumption: fuelConsumption,
      });
      // Set the fuel consumption from the response
      setFinalCost(response.data.cost_to_drive);
      console.log("this is the final cost", finalCost);
    } catch (error) {
      console.error("Error getting final cost", error);
    }
  };
  const [showLocationForm, setShowLocationForm] = useState();
  const locationFormRef = useRef(null);
  const carFormRef = useRef(null);
  const gasPriceFormRef = useRef(null);

  const handleSetShowLocationForm = () => {
    setShowLocationForm(true);
  };

  // Scroll to the next section once the corresponding data is set
  useEffect(() => {
    if (showLocationForm && locationFormRef.current) {
      locationFormRef.current.scrollIntoView();
    }
    if (distance && carFormRef.current) {
      carFormRef.current.scrollIntoView();
    }
    if (fuelConsumption && gasPriceFormRef.current) {
      gasPriceFormRef.current.scrollIntoView();
    }
  }, [showLocationForm, distance, fuelConsumption]);

  return (
    <div className="min-h-screen bg-slate-50 App">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-36 text-3xl font-semibold">Welcome to Fuel Wise!</h1>
        <p className="m-4 px-6 max-w-xl">
          Calculate the fuel cost of your journey quickly and easily. Enter your
          details, and let us do the rest!
        </p>
        {!showLocationForm && (
          <button
            onClick={handleSetShowLocationForm}
            className="bg-pink-500 hover:bg-pink-400  hover:shadow-md flex border-2 border-hidden rounded-md border-black p-2"
          >
            Get started
            <ArrowRight className="ml-2 transition-transform transform hover:translate-x-1"></ArrowRight>
          </button>
        )}
        {showLocationForm && <LocationForm
              handleGetDistance={handleGetDistance}></LocationForm> }
        {distance && 
            <CarForm
              handleFuelConsumption={handleFuelConsumption}
            ></CarForm>}
        {fuelConsumption && <GasPriceForm className="mb-8" />}
        
         {/* Refactor in own component */}
        {gasPrice && (
          <div className="mb-14">
            <p className="text-xl ">Data collected:</p>
            <p>Distance: {distance} km</p>
            <p>Gas price: {gasPrice} c/L</p>
            <p>Fuel consumption (combined): {fuelConsumption} L/100km</p>
            <button
              className="text-lg mt-4 mb-4 px-3 p-1 shadow-md bg-pink-500  hover:bg-pink-400  font-medium submit-btn"
              onClick={calculateCost}
            >
              Calculate cost for trip
            </button>
            {finalCost && (
              <span className="text-center text-2xl">
                <p className="font-bold text-center">${finalCost}</p>
                <p className="text-xlg"></p>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
