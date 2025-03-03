import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import CarForm from "./components/CarForm"; // Importing the CarForm component
import LocationForm from "./components/LocationForm";
import GasPriceForm from "./components/GasPriceForm";
import TestComponent from "./components/TestComponent";
import { ArrowRight } from "lucide-react";
import { useForm } from "./contexts/FormContext";
import { calculateDistance } from "./lib/utils";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [fuelConsumption, setFuelConsumption] = useState(null);
  const [userLocation, setUserLocation] = useState(null); //replace with startLocation
  const [restaurantLocation, setRestaurantLocation] = useState(null); //replace with endLocation
  //const [postalCode, setPostalCode] = useState(null);
  const [carFormValues, setCarFormValues] = useState({}); //move to CarForm
  const [locationFormValues, setLocationFormValues] = useState({}); //move to locationForm
  // const [gasPriceFormValues, setGasPriceFormValues] = useState({});
  const [costToDrive, setCostToDrive] = useState(null);

  const { distance, gasPrice, setDistance, setGasPrice, setStartLocation } =
    useForm();

  const handleCarFormChange = (e) => {
    setCarFormValues({ ...carFormValues, [e.target.id]: e.target.value });
  };
  const handleLocationFormChange = (e) => {
    setLocationFormValues({
      ...locationFormValues,
      [e.target.id]: e.target.value,
    });
  };

  // const handleGasPriceFormChange = (e) => {
  //   setGasPriceFormValues({
  //     ...gasPriceFormValues,
  //     [e.target.id]: Number(e.target.value),
  //   });
  // };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setUserLocation({ latitude, longitude });

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

    let startLocation = locationFormValues.start;
    if (startLocation === "Your location") {
      startLocation = `${userLocation.latitude},${userLocation.longitude}`;
    }
    console.log("starting location is: ", startLocation);

    try {
      const distance = await calculateDistance(
        startLocation,
        locationFormValues.restaurant
      );
      setDistance(distance);
    } catch (error) {
      console.error("Error getting distance:", error);
    }
  };

  // const handleGetPostalCode = async () => {
  //   try {
  //     const response = await axios.post(`${BACKEND_URL}/get_postal_code`, {
  //       longitude: userLocation.longitude,
  //       latitude: userLocation.latitude,
  //     });
  //     setPostalCode(response.data.postal_code);
  //   } catch (error) {
  //     console.error("Error getting postal code:", error);
  //   }
  // };

  // const enterGasPrice = async (e) => {
  //   e.preventDefault();
  //   const manualGasPrice = Number(gasPriceFormValues.gas); // Ensure the value is a number
  //   setGasPrice(manualGasPrice);
  // };

  const handleFuelConsumption = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/get_fuel_consumption`, {
        year: carFormValues.year,
        make: carFormValues.make,
        model: carFormValues.model,
      });
      // Set the fuel consumption from the response
      setFuelConsumption(response.data.fuel_consumption);
    } catch (error) {
      console.error("Error getting fuel consumption:", error);
    }
  };

  const calculateCost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/calculate_cost`, {
        distance: distance,
        gasPrice: gasPrice,
        fuelConsumption: fuelConsumption,
      });
      // Set the fuel consumption from the response
      setCostToDrive(response.data.cost_to_drive);
      console.log("this is the final cost", costToDrive);
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

  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 App">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-36 text-3xl font-semibold">Welcome to Fuel Wise!</h1>
        <p className="m-4 px-6 max-w-xl">
          Calculate the fuel cost of your journey quickly and easily. Enter your
          details, and let us do the rest!
        </p>
        <TestComponent />
        {!showLocationForm && (
          <button
            onClick={handleSetShowLocationForm}
            className="bg-pink-500 hover:bg-pink-400  hover:shadow-md flex border-2 border-hidden rounded-md border-black p-2"
          >
            Get started
            <ArrowRight className="ml-2 transition-transform transform hover:translate-x-1"></ArrowRight>
          </button>
        )}
        {showLocationForm && (
          <section ref={locationFormRef} className="p-8 mt-4 scroll-mt-10">
            <LocationForm
              formValues={locationFormValues}
              handleChange={handleLocationFormChange}
              handleGetDistance={handleGetDistance}
            />
          </section>
        )}
        {distance && (
          <section ref={carFormRef}>
            <CarForm
              formValues={carFormValues}
              handleChange={handleCarFormChange}
              handleFuelConsumption={handleFuelConsumption}
            ></CarForm>
          </section>
        )}
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
            {costToDrive && (
              <span className="text-center text-2xl">
                <p className="font-bold text-center">${costToDrive}</p>
                <p className="text-xlg"></p>
              </span>
            )}
          </div>
        )}
      </div>

      {/* {distance && <p>Distance: {distance} km</p>} */}

      {/* {fuelConsumption && <p>Fuel consumption (combined): {fuelConsumption} L/100km</p>} */}
    </div>
  );
}

export default App;
