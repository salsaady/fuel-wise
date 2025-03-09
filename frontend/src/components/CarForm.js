/**
 * CarForm Component
 *
 * Displays a multi-step form for selecting a vehicle's details (year, make, model).
 * Fetches available years on mount, then makes and models based on user selections.
 * On form submission, it retrieves and stores the vehicle's fuel consumption.
 */
import React, { useState, useEffect } from "react";
import { useForm } from "../contexts/FormContext";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CarForm = () => {
  // Retrieve vehicle state and setter functions from context
  const { vehicle, setVehicle, setFuelConsumption } = useForm();

  // Local states for dropdown options
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  // Extract selected values from vehicle context (or default to empty string)
  const selectedYear = vehicle?.year || "";
  const selectedMake = vehicle?.make || "";
  const selectedModel = vehicle?.model || "";

  // 1. Fetch available years once on mount
  useEffect(
    () => {
      const fetchYears = async () => {
        const response = await axios.get(`${BACKEND_URL}/years`);
        setYears(response.data);
      };

      fetchYears();
      console.log(selectedYear);
    },
    [],
    [selectedYear]
  );

  // 2. Fetch makes if a year is selected, every time selectedYear changes
  useEffect(() => {
    console.log(selectedYear);
    if (selectedYear) {
      const fetchMakes = async () => {
        try {
          console.log(selectedYear);
          const response = await axios.post(`${BACKEND_URL}/makes`, {
            year: selectedYear,
          });
          console.log(response.data);
          setMakes(response.data); // Assuming setMakes updates the dropdown options
        } catch (error) {
          console.error("Error fetching makes", error);
        }
      };
      fetchMakes();
    }
  }, [selectedYear]);

  // 3. Fetch models when a make is selected, every time selectedMake changes
  useEffect(() => {
    if (selectedMake) {
      const fetchModels = async () => {
        try {
          console.log(selectedMake);
          const response = await axios.post(`${BACKEND_URL}/models`, {
            year: selectedYear,
            make: selectedMake,
          });
          console.log(response.data);
          setModels(response.data); // Assuming setMakes updates the dropdown options
          // console.log(models);
        } catch (error) {
          console.error("Error fetching makes", error);
        }
      };
      fetchModels();
    }
  }, [selectedMake, selectedYear]);

  /**
   * Updates the vehicle state in context when a dropdown value changes.
   *
   * @param {Event} e - The change event from a dropdown.
   */
  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setVehicle((prev) => ({ ...prev, [id]: value }));
  };

  /**
   * Handles form submission to fetch and store the fuel consumption.
   *
   * @param {Event} e - The form submission event.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/get_fuel_consumption`, {
        year: selectedYear,
        make: selectedMake,
        model: selectedModel,
      });
      // Update context with the fetched fuel consumption value
      setFuelConsumption(response.data.fuel_consumption);
    } catch (error) {
      console.error("Error getting fuel consumption:", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white mb-10 w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4"
    >
      <h3 className="mb-7">Enter your vehicle details</h3>
      <div className="flex justify-between items-center">
        <label className="formLabel" htmlFor="year">
          Year:{" "}
        </label>
        {/* Year Dropdown */}

        <div>
          <select
            id="year"
            className="carFormInput"
            type="number"
            value={selectedYear}
            onChange={handleSelectChange}
          >
            <option value=""></option>
            {years.map((year, idx) => (
              <option key={idx} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedYear && (
        <div className="flex justify-between items-center">
          <label className="formLabel" htmlFor="make">
            Make:{" "}
          </label>
          {/* Make Dropdown */}
          <div>
            <select
              id="make"
              className="carFormInput "
              type="text"
              value={selectedMake}
              onChange={handleSelectChange}
            >
              <option value=""></option>
              {makes.map((make, idx) => (
                <option key={idx} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {selectedMake && (
        <div className="flex justify-between items-center">
          <label className="formLabel" htmlFor="flex justify-start model">
            Model:{" "}
          </label>
          {/* Model Dropdown */}
          <div>
            <select
              id="model"
              className="carFormInput"
              type="text"
              value={selectedModel}
              onChange={handleSelectChange}
            >
              <option value=""></option>
              {models.map((model, idx) => (
                <option key={idx} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="px-3 p-1 shadow-md hover:bg-sky-600/40 bg-sky-600/50 font-medium submit-btn"
      >
        Next
      </button>
    </form>
  );
};

export default CarForm;
