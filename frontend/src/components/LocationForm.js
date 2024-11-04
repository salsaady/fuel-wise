import React from "react";
import { LocateFixed, Circle, MapPin } from "lucide-react";

const LocationForm = ({
  onNext,
  formValues,
  handleChange,
  handleGetDistance,
  getUserLocation,
}) => {
  return (
    <form
      onSubmit={handleGetDistance}
      className="w-96 p-6 px-10 rounded-lg bg-white shadow-lg mx-auto space-y-4"
    >
      <h3 className="mb-7">Choose your route</h3>
      <div className="">
        <div className="flex justify-between">
          <label className="p-2 formLabel" htmlFor="start">
            <div className="flex items-center size-5">
              <Circle className="size-4" />
            </div>
          </label>
          <input
            className="formInput  "
            type="text"
            id="start"
            value={formValues.start || ""}
            onChange={handleChange}
          />
        </div>
        <button
          type="button"
          onClick={getUserLocation}
          className="mt-3 border border-black pr-2 pl-1 py-1 text-sm submit-btn shadow-lg hover:bg-slate-200 bg-white/80"
        >
          <LocateFixed className="size-5 mr-2 text-blue-600"></LocateFixed>Your
          location
        </button>

        <div className="flex justify-between my-6">
          <label className="p-2 formLabel " htmlFor="restaurant">
            <MapPin className="size-5 text-red-600" />
          </label>
          <input
            className="formInput"
            type="text"
            id="restaurant"
            value={formValues.restaurant || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <button
        onClick={onNext}
        type="submit"
        className="px-3 p-1 shadow-md hover:bg-sky-600/40 bg-sky-600/50 font-medium submit-btn"
      >
        Next
      </button>
    </form>
  );
};

export default LocationForm;
