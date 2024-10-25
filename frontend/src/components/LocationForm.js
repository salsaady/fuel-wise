import React, {useState} from 'react'


const LocationForm = ({ formValues, handleChange, handleGetDistance, getUserLocation}) => {
    return (
        <form onSubmit={handleGetDistance}>
            <div className='input-group'>
                <label htmlFor="start">Starting Point</label>
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
                >Use my location</button>
            <div className='input-group'>
                <label htmlFor="restaurant">Restaurant</label>
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