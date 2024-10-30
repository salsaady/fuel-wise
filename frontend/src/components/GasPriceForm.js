import React from "react";
import { Navigation } from 'lucide-react';

const GasPriceForm = ({formValues, handleChange, fetchGasPrice, gasPrice, enterGasPrice })=>{
    return (
        <form onSubmit={enterGasPrice}
        className="mb-14 w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4">
            <h3 className="mb-7">Determine gas price</h3>
             <button 
                type="pr-2 pl-1 py-1 text-sm submit-btn shadow-lg hover:bg-white/100  bg-white/80"
                onClick={()=>{fetchGasPrice()}}
                className="pr-2 pl-1 py-1 text-sm submit-btn shadow-lg hover:bg-white/100  bg-white/80">
                <Navigation className="ml-1 mt-1 mb-1 h-4 w-5 mr-2 text-blue-600" />Fetch live gas price</button>
            <p className="mb-3 flex justify-center">Or</p>
            <div className="flex justify-between">
            <label className="formLabel" htmlFor="gas">Enter gas price: </label>
            <input className=" gasFormInput shadow "
              type="number"
              id="gas"
              value={formValues.gas || ""}
              onChange={handleChange}
            />
            </div>
      
            <button type="submit" className = "px-3 p-1 shadow-md hover:bg-blue-200 bg-blue-300 font-medium submit-btn">Next</button>
        </form>
    )
}

export default GasPriceForm