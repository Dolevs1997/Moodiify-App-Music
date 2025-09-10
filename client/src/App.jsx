import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import CategoryPlaylists from "./pages/CategoryPlaylists/CategoryPlaylists";
import { useEffect } from "react";
import Register from "./pages/Register/Register";
import SongsPlaylist from "./pages/SongsPlaylist/SongsPlaylist";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import SongsPlaylistUser from "./pages/SongsPlaylistUser/SongsPlaylistUser";
import Categories from "./components/Categories/Categories";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);

  return (
    <BrowserRouter basename="/moodiify">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
        <Route path="/global" element={<Home />}>
          <Route path="categories" element={<Categories />} />
        </Route>

        <Route path="/home" element={<Home />}>
          <Route path="categories" element={<Navigate to="/home" />} />
          <Route path="songSuggestions" element={<Navigate to="/home" />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
