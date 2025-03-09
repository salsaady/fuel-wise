/**
 * App.js
 *
 * Main component that orchestrates the multi-step Fuel Wise application.
 * It retrieves the user's geolocation, manages the flow between different forms,
 * and displays the final trip summary.
 */

import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import CarForm from "./components/CarForm";
import LocationForm from "./components/LocationForm";
import GasPriceForm from "./components/GasPriceForm";
import TripSummary from "./components/TripSummary";
import { ArrowRight } from "lucide-react";
import { useForm } from "./contexts/FormContext";

function App() {
  // Retrieve shared state from FormContext
  const { distance, gasPrice, fuelConsumption, finalCost, setStartLocation } =
    useForm();

  // On mount, get user geolocation which is stored in the FormContext (startLocation)
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

  // Local states to control which forms are shown & scrolling
  const [showLocationForm, setShowLocationForm] = useState();
  const locationFormRef = useRef(null);
  const carFormRef = useRef(null);
  const gasPriceFormRef = useRef(null);

  // Handler to show the LocationForm
  const handleSetShowLocationForm = () => {
    setShowLocationForm(true);
  };

  // Scroll to the next section once the corresponding data is set
  useEffect(() => {
    if (showLocationForm && locationFormRef.current) {
      locationFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (distance && carFormRef.current) {
      carFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (fuelConsumption && gasPriceFormRef.current) {
      gasPriceFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showLocationForm, distance, fuelConsumption]);

  return (
    <div className="min-h-screen bg-slate-100 pb-80 App">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-36 text-3xl font-semibold">Welcome to Fuel Wise!</h1>
        <p className="m-4 px-6 max-w-xl">
          Calculate the fuel cost of your journey quickly and easily. Enter your
          details, and let us do the rest!
        </p>
        {/* Show a "Get started" button until the user initiates the process */}
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
          <section ref={locationFormRef} className="w-full mt-10">
            <LocationForm />
          </section>
        )}

        {/* Step 2: Car Form */}
        {distance && (
          <section ref={carFormRef} className="w-full mt-10">
            <CarForm />
          </section>
        )}

        {/* Step 3: Gas Price Form */}
        {fuelConsumption && (
          <section ref={gasPriceFormRef} className="w-full mt-10">
            <GasPriceForm className="mb-8" />
          </section>
        )}
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
