import { createContext, useContext, useState } from "react";
import axios from "axios";
/*
distance
gasPrice
vehicle
    - year
    - make
    - model
fuelConsumption
startLocation
endLocation
finalCost

*/
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FormContext = createContext({
  distance: null,
  gasPrice: null,
  vehicle: null,
  fuelConsumption: null,
  startLocation: null,
  endLocation: null,
  finalCost: null,
});

export default function FormContextProvider({ children }) {
  const [distance, setDistance] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [fuelConsumption, setFuelConsumption] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [finalCost, setFinalCost] = useState(null);

  const value = {
    distance,
    gasPrice,
    vehicle,
    fuelConsumption,
    startLocation,
    endLocation,
    finalCost,
    setDistance,
    setGasPrice,
    setVehicle,
    setFuelConsumption,
    setStartLocation,
    setEndLocation,
    setFinalCost,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm() {
  const data = useContext(FormContext);

  if (!data) {
    throw new Error("You need to use useForm() inside of FormContextProvider");
  }

  return data;
}
