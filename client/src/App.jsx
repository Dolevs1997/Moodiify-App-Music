import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/moodiify" index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
