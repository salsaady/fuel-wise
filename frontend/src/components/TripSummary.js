/**
 * TripSummary Component
 *
 * Displays the summary of trip data including distance, gas price,
 * fuel consumption, and the final calculated driving cost.
 * Provides a button to trigger the cost calculation.
 */

import React from "react";
import { useForm } from "../contexts/FormContext";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function TripSummary() {
  // Access trip-related state and setters from the FormContext
  const { distance, gasPrice, fuelConsumption, finalCost, setFinalCost } =
    useForm();

  /**
   * Calculates the final cost to drive the trip.
   * Sends a POST request with distance, gas price, and fuel consumption.
   * Updates the finalCost in the context with the response.
   *
   * @param {Event} e - The click event.
   */
  const calculateCost = async (e) => {
    e.preventDefault(); // Prevent any default form submission behavior
    try {
      const response = await axios.post(`${BACKEND_URL}/calculate_cost`, {
        distance: distance,
        gasPrice: gasPrice,
        fuelConsumption: fuelConsumption,
      });
      // Set the final cost in the context
      setFinalCost(response.data.cost_to_drive);
      console.log("this is the final cost", finalCost);
    } catch (error) {
      console.error("Error getting final cost", error);
    }
  };

  return (
    <div className="w-96 mx-auto bg-white rounded-lg shadow-md p-6 mb-14">
      <h3 className="text-2xl font-semibold mb-4 text-center">Trip Summary</h3>

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
          {fuelConsumption ? `${fuelConsumption.toFixed(2)} L/100km` : "N/A"}
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
          <p className="font-bold">${finalCost.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default TripSummary;
