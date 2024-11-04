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
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [restaurantSuggestions, setRestaurantSuggestions] = useState([]);

  // Fetch suggestions based on input query
  const fetchSuggestions = async (query, setSuggestions) => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/autocomplete", {
        params: { input: query },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounced functions for each field
  const debouncedFetchStartSuggestions = debounce((query) => {
    if (query) fetchSuggestions(query, setStartSuggestions);
  }, 300);

  const debouncedFetchRestaurantSuggestions = debounce((query) => {
    if (query) fetchSuggestions(query, setRestaurantSuggestions);
  }, 300);

  const handleStartChange = (e) => {
    handleChange(e);
    debouncedFetchStartSuggestions(e.target.value);
  };

  const handleRestaurantChange = (e) => {
    handleChange(e);
    debouncedFetchRestaurantSuggestions(e.target.value);
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
            className="formInput"
            type="text"
            id="start"
            value={formValues.start || ""}
            onChange={handleStartChange}
          />
          {startSuggestions.length > 0 && (
            <ul className="text-sm w-1/2 absolute z-10 mt-10 bg-white border border-gray-300 rounded-md shadow-lg">
              {startSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleChange({
                      target: {
                        id: "start",
                        value: suggestion.description,
                      },
                    });
                    setStartSuggestions([]);
                  }}
                >
                  <MapPin className="flex-shrink-0 flex-grow-0 mr-3 w-5 h-5 text-slate-600" />
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
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
          <label className="p-2 formLabel" htmlFor="restaurant">
            <MapPin className="size-5 text-red-600" />
          </label>
          <input
            className="formInput"
            type="text"
            id="restaurant"
            value={formValues.restaurant || ""}
            onChange={handleRestaurantChange}
          />

          {restaurantSuggestions.length > 0 && (
            <ul className="w-1/2 text-sm absolute z-10 mt-10 bg-white border border-gray-300 rounded-md shadow-lg">
              {restaurantSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex  items-center px-2 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleChange({
                      target: {
                        id: "restaurant",
                        value: suggestion.description,
                      },
                    });
                    setRestaurantSuggestions([]);
                  }}
                >
                  <MapPin className="flex-shrink-0 flex-grow-0 mr-3 w-5 h-5 text-slate-600" />
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
