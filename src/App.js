import "./App.css";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import Logo from "./components/Logo";
function App() {
  return (
    <>
      <NavBar>
        <h1>Moodiify</h1>
        <Logo />
        <Search />
      </NavBar>
    </>
  );
}

export default App;
