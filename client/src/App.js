import "./App.css";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import Logo from "./components/Logo";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <NavBar>
        <h1>Moodiify</h1>
        <Logo />
        <Search />
      </NavBar>
      <Home />
    </>
  );
}

export default App;
