import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import CategoryPlaylists from "./pages/CategoryPlaylists/CategoryPlaylists";
import { useEffect } from "react";
import Register from "./pages/Register/Register";
import SongsPlaylist from "./pages/SongsPlaylist/SongsPlaylist";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
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
        <Route path="/category/playlists" element={<CategoryPlaylists />} />

        <Route
          path="/category/playlists/:playlistId/songs"
          element={<SongsPlaylist />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />}>
          <Route path="categories" element={<Navigate to="/home" />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
