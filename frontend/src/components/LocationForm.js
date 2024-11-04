import React, { useEffect, useState } from "react";
import { LocateFixed, Circle, MapPin } from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";

const LocationForm = ({
  onNext,
  formValues,
  handleChange,
  handleGetDistance,
  getUserLocation,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions based on input query
  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/autocomplete", {
        params: { input: query },
      });
      setSuggestions(response.data);
      console.log(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounce fetchSuggestions to limit API calls
  const debouncedFetchSuggestions = debounce((query) => {
    if (query) fetchSuggestions(query);
  }, 300);

  const handleRestaurantChange = (e) => {
    handleChange(e);
    debouncedFetchSuggestions(e.target.value);
  };
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
            onChange={handleRestaurantChange}
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
            onChange={handleRestaurantChange}
          />

          {suggestions.length > 0 && (
            <ul className=" absolute z-10 mt-10  bg-white border border-gray-300 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleChange({
                      target: {
                        id: "restaurant",
                        value: suggestion.description,
                      },
                    });
                    setSuggestions([]);
                  }}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
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
