import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useEffect } from "react";
import Register from "./pages/Register";

function App() {
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);

  return (
    <BrowserRouter basename="/moodiify">
      <Routes>
        {/* Redirect the base URL to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/categories" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="categories" element={<Navigate to="/home" />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
