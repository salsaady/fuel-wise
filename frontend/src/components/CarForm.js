import React from 'react'

const CarForm = ({ formValues, handleChange, handleFuelConsumption }) => {
  return (
    <form onSubmit={handleFuelConsumption}>
        <h3>Enter vehicle details</h3>
      <div className="input-group">
        <label htmlFor="year">Year: </label>
        <input
          type="number"
          id="year"
          value={formValues.year || ""}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <label htmlFor="make">Make: </label>
        <input
          type="text"
          id="make"
          value={formValues.make || ""}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <label htmlFor="model">Model: </label>
        <input
          type="text"
          id="model"
          value={formValues.model || ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  )
}

export default CarForm

