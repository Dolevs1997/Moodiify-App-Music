import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Home from "./pages/Home";
import { useEffect } from "react";
import Categories from "./components/Categories/Categories";

function App() {
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="moodiify" element={<Home />}>
          <Route element={<Navigate to="moodiify" />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
