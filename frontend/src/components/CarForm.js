import React, { useState, useEffect } from "react";
import axios from "axios";

const CarForm = ({ formValues, handleChange, handleFuelConsumption }) => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchYears = async () => {
      const response = await axios.get("http://127.0.0.1:5000/years");
      setYears(response.data);
    };

    fetchYears();
  }, []);

  return (
    <form
      onSubmit={handleFuelConsumption}
      className="bg-white mb-14 w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4"
    >
      <h3 className="mb-7">Enter your vehicle details</h3>
      <div className="flex justify-between">
        <label className="formLabel" htmlFor="year">
          Year:{" "}
        </label>
        {/* Year Dropdown */}

        <div>
          <select
            id="year"
            className="carFormInput"
            type="number"
            value={formValues.year || selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              handleChange(e);
            }}
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
      <div className="flex justify-between">
        <label className="formLabel" htmlFor="make">
          Make:{" "}
        </label>
        <input
          className="carFormInput shadow ml-4"
          type="text"
          id="make"
          value={formValues.make || ""}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between">
        <label className="formLabel" htmlFor="flex justify-start model">
          Model:{" "}
        </label>
        <input
          className="flex justify-end carFormInput shadow ml-2"
          type="text"
          id="model"
          value={formValues.model || ""}
          onChange={handleChange}
        />
      </div>
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
