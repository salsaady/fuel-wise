import React from "react";
import { Navigation } from "lucide-react";

const GasPriceForm = ({
  formValues,
  handleChange,
  fetchGasPrice,
  gasPrice,
  enterGasPrice,
}) => {
  return (
    <form
      onSubmit={enterGasPrice}
      className="bg-white mb-14 w-96 p-6 px-10 rounded-lg shadow-lg mx-auto space-y-4"
    >
      <h3 className="mb-7">Determine gas price</h3>

      <button
        type=" pr-2 pl-1 py-1 text-sm submit-btn shadow-lg hover:bg-white/100  bg-white/80"
        onClick={() => {
          fetchGasPrice();
        }}
        className="hover:bg-slate-200 border border-black pr-2 pl-1 py-1 text-sm submit-btn shadow-lg bg-white/80"
      >
        <div className="px-1 flex justify-between items-center ">
          <div className="flex items-center size-6">
            <Navigation className="size-4 text-blue-600" />
          </div>
          <p className="flex justify-self-end "> Fetch live gas price</p>
        </div>
      </button>

      <p className="text-center text-lg">Or</p>
      <div className="flex justify-between items-center">
        <label className="formLabel" htmlFor="gas">
          Enter gas price:{" "}
        </label>
        <input
          className=" gasFormInput"
          type="number"
          id="gas"
          value={formValues.gas || ""}
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

export default GasPriceForm;
