import React, { useEffect, useState } from "react";
import { LocateFixed, Circle, MapPin } from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LocationForm = ({
  onNext,
  formValues,
  handleChange,
  handleGetDistance,
}) => {
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [restaurantSuggestions, setRestaurantSuggestions] = useState([]);

  // Fetch suggestions based on input query
  const fetchSuggestions = async (query, setSuggestions) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/autocomplete`, {
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
      {/* Start Location Input with Dropdown */}
      <h3 className="">Determine your route</h3>
      <div className="relative pb-6">
        <div className="flex justify-between">
          <label className="p-2 flex  items-center formLabel" htmlFor="start">
            <div className="flex justify-center items-center size-5">
              <Circle className="size-4" />
            </div>
          </label>
          <input
            className="formInput"
            type="text"
            id="start"
            placeholder="Choose starting point..."
            value={formValues.start || ""}
            onChange={handleStartChange}
            autoComplete="off"
          />
        </div>
        {startSuggestions.length > 0 && (
          <ul className="text-sm absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <li
              className="flex w-72 mr-4 items-center px-2 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                handleChange({
                  target: {
                    id: "start",
                    value: "Your location",
                  },
                });
                setStartSuggestions([]);
              }}
            >
              <LocateFixed className="mr-2 w-5 h-5 text-blue-600" />
              Your location
            </li>
            <hr className="my-1 border-gray-200" />
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
      <div className="relative ">
        <div className="flex justify-between">
          <label
            className="p-2 flex items-center formLabel"
            htmlFor="restaurant"
          >
            <MapPin className="justify-center items-center size-5 text-red-600" />
          </label>
          <input
            className="formInput"
            type="text"
            id="restaurant"
            value={formValues.restaurant || ""}
            onChange={handleRestaurantChange}
            placeholder="Choose destination..."
            autoComplete="off"
          />

          {restaurantSuggestions.length > 0 && (
            <ul className="text-sm w-auto absolute z-10 mt-10 bg-white border border-gray-300 rounded-md shadow-lg">
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
