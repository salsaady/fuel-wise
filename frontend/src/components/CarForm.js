import React from "react";

const CarForm = ({ formValues, handleChange, handleFuelConsumption }) => {
  return (
    <form
      onSubmit={handleFuelConsumption}
      className="bg-white mb-14 w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4"
    >
      <h3 className="mb-7">Enter vehicle details</h3>
      <div className="flex justify-between">
        <label className="formLabel" htmlFor="year">
          Year:{" "}
        </label>
        <input
          className="carFormInput shadow ml-4"
          type="number"
          id="year"
          value={formValues.year || ""}
          onChange={handleChange}
        />
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
