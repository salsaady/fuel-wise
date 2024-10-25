import React from 'react'

const LocationForm = ({ formValues, handleChange, handleGetDistance, getUserLocation}) => {
    return (
        <form onSubmit={handleGetDistance}>
            <h3>Choose driving distance</h3>
            <div className='input-group'>
                <label htmlFor="start">Starting Point: </label>
                <input
                  type="text"
                  id="start"
                  value={formValues.start || " "}
                  onChange={handleChange}
                />
            </div>
            <button 
                type="button"
                onClick={()=>{getUserLocation()
                }
                }
                >Use your location</button>
            <div className='input-group'>
                <label htmlFor="restaurant">Restaurant Address: </label>
                <input
                  type="text"
                  id="restaurant"
                  value={formValues.restaurant || ""}
                  onChange={handleChange}
                />
            </div>
            <button type="submit" className = "submit-btn">Submit</button>
        </form>
    )
}

export default LocationForm