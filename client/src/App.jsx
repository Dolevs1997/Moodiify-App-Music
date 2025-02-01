// import { BrowserRouter, Routes } from "react-router";
import Home from "./pages/Home";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);

  return (
    <Home />
    // <BrowserRouter>
    //   <Routes index component={Home}></Routes>
    // </BrowserRouter>
  );
}

export default App;
