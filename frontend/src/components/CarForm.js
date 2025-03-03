import React, { useState, useEffect } from "react";
import { useForm } from "../contexts/FormContext";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const CarForm = ({ handleFuelConsumption }) => {
  const {vehicle, setVehicle} = useForm();
  const [years, setYears] = useState([]);
  //onst [selectedYear, setSelectedYear] = useState("");
  const [makes, setMakes] = useState([]);
  //const [selectedMake, setSelectedMake] = useState("");
  const [models, setModels] = useState([]);
  //const [selectedModel, setSelectedModel] = useState("");

  const selectedYear = vehicle?.year || "";
  const selectedMake = vehicle?.make || "";
  const selectedModel = vehicle?.model || "";


  // Fetch available years once on mount
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

  // Fetch makes if a year is selected, every time selectedYear changes
  useEffect(() => {
    console.log(selectedYear);
    if (selectedYear){
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

  // Fetch models when a make is selected, every time selectedMake changes
  useEffect(() => {
    if (selectedMake){
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
  
   // Update vehicle state in context
   const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setVehicle((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <form
      onSubmit={handleFuelConsumption}
      className="bg-white mb-14 w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4"
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
        {/* <input
          className="carFormInput shadow ml-4"
          type="number"
          id="year"
          value={formValues.year || ""}
          onChange={handleChange}
        /> */}
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
          {/* <input
          className="carFormInput shadow ml-4"
          type="text"
          id="make"
          value={formValues.make || ""}
          onChange={handleChange}
        /> */}
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
          {/* <input
          className="flex justify-end carFormInput shadow ml-2"
          type="text"
          id="model"
          value={formValues.model || ""}
          onChange={handleChange}
        /> */}
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
