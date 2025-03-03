/**
 * GasPriceForm Component
 *
 * Provides two ways for the user to set a gas price:
 * - Fetch the live gas price based on the user's location.
 * - Manually enter a gas price.
 *
 * When the user clicks "Next", the form submission is prevented,
 * and the chosen gas price is stored in context.
 */

import React from "react";
import { Navigation } from "lucide-react";
import { useForm } from "../contexts/FormContext";
import { getLiveGasPrice } from "../lib/utils";

const GasPriceForm = () => {
  // Retrieve location and gas price from context
  const { startLocation, gasPrice, setGasPrice } = useForm();

  /**
   * Fetches the live gas price using the user's start location
   * and updates the gasPrice state.
   */
  async function handleUseCurrentLocationGasPrice() {
    const locationGasPrice = await getLiveGasPrice(startLocation);
    setGasPrice(locationGasPrice);
  }

  /**
   * Updates the gas price as the user types in the input field.
   *
   * @param {Event} e - The input change event.
   */
  function handleChangeGasPrice(e) {
    setGasPrice(e.target.valueAsNumber);
  }

  /**
   * Prevents default form submission behavior.
   *
   * @param {Event} e - The form submission event.
   */
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white mb-14 w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4"
    >
      <h3 className="mb-7">Determine gas price</h3>

      {/* Button to fetch live gas price based on user's start location */}
      <button
        type="button"
        onClick={handleUseCurrentLocationGasPrice}
        className="hover:bg-slate-200 border border-black pr-2 pl-1 py-1 text-sm submit-btn shadow-lg bg-white/80"
      >
        <div className="px-1 flex justify-between items-center ">
          <div className="flex items-center size-6">
            <Navigation className="size-4 text-blue-600" />
          </div>
          <p className="flex justify-self-end "> Fetch live gas price</p>
        </div>
      </button>

      <p className="text-center text-lg">Or</p>

      {/* Manual gas price entry */}
      <div className="flex justify-between items-center">
        <label className="formLabel" htmlFor="gas">
          Enter gas price:{" "}
        </label>
        <input
          className="gasFormInput"
          type="number"
          id="gas"
          step="any"
          value={gasPrice}
          onChange={handleChangeGasPrice}
        />
      </div>

      {/* Next button prevents form submission and triggers next step */}
      <button
        type="submit"
        className="px-3 p-1 shadow-md hover:bg-sky-600/40 bg-sky-600/50 font-medium submit-btn"
      >
        Next
      </button>
    </form>
  );
};

export default GasPriceForm;
