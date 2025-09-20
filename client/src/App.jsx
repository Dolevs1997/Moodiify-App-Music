import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import CategoryPlaylists from "./pages/CategoryPlaylists/CategoryPlaylists";
import { useEffect } from "react";
import Register from "./pages/Register/Register";
import SongsPlaylist from "./pages/SongsPlaylist/SongsPlaylist";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import SongsPlaylistUser from "./pages/SongsPlaylistUser/SongsPlaylistUser";
import "bootstrap/dist/css/bootstrap.min.css";
import Categories from "./components/Categories/Categories";
import Logo from "./components/Logo/Logo";
// import Search from "./components/Search/Search";
import NavBar from "./components/NavBar/NavBar";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);

  return (
    <BrowserRouter basename="/moodiify">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />}>
          <Route path="categories" element={<Categories user={user} />} />
          <Route
            path="songSuggestions"
            element={<Navigate to="/home" replace />}
          />
        </Route>

        <Route
          path="/category/playlists"
          element={<CategoryPlaylists />}
        ></Route>
        <Route
          path="/category/playlists/:playlistId/songs"
          element={<SongsPlaylist />}
        />

        <Route
          path="/myplaylists/:playlistId"
          element={<SongsPlaylistUser />}
        />
        <Route path="/global" element={<Home />} />
        <Route
          path="/global/categories/:country"
          element={
            <div className="home">
              <div className="header">
                <Logo />
                <NavBar user={user} />
              </div>
              <Categories user={user} />
            </div>
          }
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
