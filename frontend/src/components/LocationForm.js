import React from 'react'
import {LocateFixed, Circle, MapPin} from 'lucide-react'

const LocationForm = ({onNext, formValues, handleChange, handleGetDistance, getUserLocation}) => {
    return (
        <form onSubmit={handleGetDistance}
        className="w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4"
            >
            <h3 className="mb-7">Choose driving distance</h3>
            <div className="">
            <div className='flex justify-between'>
                <label className="formLabel p-1" htmlFor="start"> <Circle className="size-4"/> </label>
                <input className="formInput shadow "
                  type="text"
                  id="start"
                  value={formValues.start || ""}
                  onChange={handleChange}
                />
            </div>
            <button 
                type="button"
                onClick={getUserLocation}
                className="pr-2 pl-1 py-1 text-sm submit-btn shadow-lg hover:bg-white/100  bg-white/80"><LocateFixed className="size-5 mr-2 text-blue-600" ></LocateFixed>Your location</button>
             
            <div className='flex justify-between my-6'>
                <label className="formLabel " htmlFor="restaurant"><MapPin className="size-5 text-red-600"/></label>
                <input className="formInput shadow-lg"
                  type="text"
                  id="restaurant"
                  value={formValues.restaurant || ""}
                  onChange={handleChange}
                />
            </div>
            </div>
            <button onClick={onNext} type="submit" className = "px-3 p-1 shadow-md hover:bg-blue-200 bg-blue-300 font-medium submit-btn">Next</button>
        </form>
    )
}

export default LocationForm