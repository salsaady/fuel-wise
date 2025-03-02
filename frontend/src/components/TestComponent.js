import { useForm } from "../contexts/FormContext";

export default function TestComponent() {
  const { gasPrice, setGasPrice } = useForm();

  function handleIncrement() {
    setGasPrice((prev) => prev + 1);
  }

  return (
    <div>
      <button onClick={handleIncrement}>Increment Gas Price</button>
      <div>Gas Price: {gasPrice}</div>
    </div>
  );
}
