import React from "react";

const GasPriceForm = ({formValues, handleChange, fetchGasPrice, gasPrice, enterGasPrice })=>{
    return (
        <form onSubmit={enterGasPrice}>
            <h3>Determine gas price</h3>
             <button 
                type="button"
                onClick={()=>{fetchGasPrice()}}
                >Fetch gas price</button>
                <div className="input-group">
                <p>Or</p>
            <label htmlFor="gas">Enter gas price: </label>
            <input
              type="number"
              id="gas"
              value={formValues.gas || ""}
              onChange={handleChange}
            />
            </div>
      
            <button type="submit" className="submit-btn">Enter</button>
        </form>
    )
}

export default GasPriceForm