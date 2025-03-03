import React from "react";
import { useForm } from "../contexts/FormContext";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function TripSummary(){
  const { distance, gasPrice, fuelConsumption, finalCost, setFinalCost, } = useForm()
  
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

  return (
    <div className="w-96 mx-auto bg-white rounded-lg shadow-md p-6 mb-14">
      <h3 className="text-2xl font-semibold mb-4 text-center">
        Trip Summary
      </h3>

      <div className="space-y-2 text-lg">
        <p>
          <span className="font-medium">Distance:</span>{" "}
          {distance ? `${distance.toFixed(2)} km` : "N/A"}
        </p>
        <p>
          <span className="font-medium">Gas price:</span>{" "}
          {gasPrice ? `${gasPrice} c/L` : "N/A"}
        </p>
        <p>
          <span className="font-medium">Fuel consumption:</span>{" "}
          {fuelConsumption
            ? `${fuelConsumption.toFixed(2)} L/100km`
            : "N/A"}
        </p>
      </div>

      <button
        onClick={calculateCost}
        className="mt-6 w-full py-2 bg-pink-500 hover:bg-pink-400 text-white font-medium rounded-md shadow-sm transition-colors"
      >
        Calculate cost for trip
      </button>

      {finalCost && (
        <div className="mt-6 text-center text-2xl">
          <p className="font-bold">
            ${finalCost.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  )
}

export default TripSummary;
