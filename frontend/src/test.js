import { useEffect, useState } from "react";

export default function Test() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const res = await fetch("http://127.0.0.1:5000/check");
      const data = await res.json();
      console.log("Data: ", data);
      setData(data);
    }
    getData();
  }, []);
  return (
    <div>
      <pre>{JSON.stringify(data, null, "\t")}</pre>
    </div>
  );
}
