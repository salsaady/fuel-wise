/**
 * LocationForm Component
 *
 * Renders a form for determining the route by letting the user enter a starting
 * point and destination. It fetches autocomplete suggestions for both fields,
 * updates local and global state, and calculates the trip distance on submission.
 */

import React, { useEffect, useState, useRef } from "react";
import { LocateFixed, Circle, MapPin, EllipsisVertical } from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useForm } from "../contexts/FormContext";
import { calculateDistance, getUserLocationString } from "../lib/utils";
import { Loader2Icon } from "lucide-react";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LocationForm = () => {
  // Local state for autocomplete suggestions
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  // Access global state and setters from FormContext
  const { setDistance, startLocation, setStartLocation, setEndLocation } =
    useForm();

  // Local state for input values
  const [localValues, setLocalValues] = useState({
    start: "",
    destination: "",
  });

  /**
   * Fetch autocomplete suggestions from the backend.
   *
   * @param {string} query - The user's input.
   * @param {function} setSuggestions - Setter to update the suggestions state.
   */
  const fetchSuggestions = async (query, setSuggestions) => {
    // If there's no query, do nothing and clear suggestions
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/autocomplete`, {
        params: {
          input: query,
          // Pass user start location from context
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
        },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Debounced functions to limit API calls as the user types
  const debouncedFetchStartSuggestions = debounce((query) => {
    if (query) fetchSuggestions(query, setStartSuggestions);
  }, 300);

  const debouncedFetchDestinationSuggestions = debounce((query) => {
    if (query) fetchSuggestions(query, setDestinationSuggestions);
  }, 300);

  // Update the start input and trigger suggestions fetch
  const handleStartChange = (e) => {
    const value = e.target.value;
    setLocalValues((prev) => ({ ...prev, start: value }));
    debouncedFetchStartSuggestions(value);
  };

  // Update the destination input and trigger suggestions fetch
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setLocalValues((prev) => ({ ...prev, destination: value }));
    debouncedFetchDestinationSuggestions(value);
  };

  /**
   * Handle selection of a start suggestion.
   * Updates both local input value and the global state.
   *
   * @param {string} value - The selected suggestion.
   */
  const handleSelectStart = (value) => {
    setLocalValues((prev) => ({ ...prev, start: value }));
    // If the suggestion is "Your location," keep the geolocation context.
    // Otherwise, update the start location with the chosen description.
    if (value !== "Your location") {
      setStartLocation({ description: value });
    }
    setStartSuggestions([]); // Clear suggestions after selection
  };

  /**
   * Handle selection of a destination suggestion.
   * Updates both local input value and the global state.
   *
   * @param {string} value - The selected suggestion.
   */
  const handleSelectDestination = (value) => {
    setLocalValues((prev) => ({ ...prev, destination: value }));
    setEndLocation({ description: value });
    setDestinationSuggestions([]); // Clear suggestions after selection
  };

  /**
   * Handles form submission by calculating the trip distance.
   *
   * Retrieves a unified user location string (custom or lat/lon)
   * and uses it along with the destination input to calculate distance.
   *
   * @param {Event} e - Form submission event.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!startLocation) return console.error("Start location not set");

    const userLocString = getUserLocationString(startLocation);
    const dest = localValues.destination;
    try {
      const dist = await calculateDistance(userLocString, dest);
      setDistance(dist);
    } catch (error) {
      console.error("Error getting distance:", error);
    }
  }

  // Ref for the form to detect clicks outside
  const formRef = useRef(null);

  // Effect: Clear suggestions when clicking outside the form.
  useEffect(() => {
    function handleClickOutside(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setStartSuggestions([]);
        setDestinationSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-96 p-6 px-10 rounded-lg bg-white shadow-lg mx-auto  mb-10"
    >
      {/* Start Location Input with Dropdown */}
      <h3 className="pb-4">Determine your route</h3>
      <div className="relative ">
        <div className="flex justify-between ">
          <label className="p-2 flex  items-center formLabel" htmlFor="start">
            <div className="flex justify-center items-center size-5 ">
              <Circle className="size-4" />
            </div>
          </label>
          <input
            ref={formRef}
            className="formInput"
            type="text"
            id="start"
            placeholder="Choose starting point..."
            value={localValues.start || ""}
            onChange={handleStartChange}
            autoComplete="off"
          />
        </div>
        {startSuggestions.length > 0 && (
          <ul className="text-sm w-full absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <li
              className="flex mr-4 items-center px-2 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectStart("Your location")}
            >
              <LocateFixed className="mr-2 w-5 h-5 text-blue-600" />
              Your location
            </li>
            <hr className="my-1 border-gray-200" />
            {startSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectStart(suggestion.description)}
              >
                <MapPin className="flex-shrink-0 flex-grow-0 mr-3 w-5 h-5 text-slate-600" />
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex pl-1.5 flex-col ">
        <EllipsisVertical></EllipsisVertical>
      </div>
      {/* Destination Input */}
      <div className="relative ">
        <div className="flex pb-4 justify-between">
          <label
            className="p-2 flex items-center formLabel"
            htmlFor="destination"
          >
            <MapPin className="justify-center items-center size-5 text-red-600" />
          </label>
          <input
            className="formInput"
            type="text"
            id="destination"
            value={localValues.destination || ""}
            onChange={handleDestinationChange}
            placeholder="Choose destination..."
            autoComplete="off"
          />

          {destinationSuggestions.length > 0 && (
            <ul className="w-full text-sm absolute z-10 mt-11  bg-white border border-gray-300 rounded-md shadow-lg">
              {destinationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    handleSelectDestination(suggestion.description)
                  }
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
        type="submit"
        className="px-3 p-1 shadow-md hover:bg-sky-600/40 bg-sky-600/50 font-medium submit-btn"
      >
        Next
      </button>
    </form>
  );
};

export default LocationForm;
