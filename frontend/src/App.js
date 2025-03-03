import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import CarForm from "./components/CarForm";
import LocationForm from "./components/LocationForm";
import GasPriceForm from "./components/GasPriceForm";
import TripSummary from "./components/TripSummary";
import { ArrowRight } from "lucide-react";
import { useForm } from "./contexts/FormContext";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const {
    distance,
    gasPrice,
    startLocation,
    fuelConsumption,
    finalCost,
    setDistance,
    setGasPrice,
    setStartLocation,
    setFuelConsumption,
    setFinalCost,
  } = useForm();

  // On mount, get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setStartLocation({ latitude, longitude });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Control which forms are shown & scrolling
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
        {showLocationForm && <LocationForm />}
        {distance && <CarForm />}
        {fuelConsumption && <GasPriceForm className="mb-8" />}
        {gasPrice && (
          <TripSummary
            distance={distance}
            gasPrice={gasPrice}
            fuelConsumption={fuelConsumption}
            finalCost={finalCost}
          />
        )}
      </div>
    </div>
  );
}

export default App;
