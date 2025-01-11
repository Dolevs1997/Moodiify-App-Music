import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);
  useEffect(function () {
    async function fetchData() {
      console.log("http://10.0.0.101:3001");
      const res = await fetch(`http://10.0.0.101:3001/moodiify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    }
    fetchData();
  }, []);
  return <div className="home"></div>;
}
