import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);
  return (
    <div className="home">
      <h1>Home</h1>
    </div>
  );
}
