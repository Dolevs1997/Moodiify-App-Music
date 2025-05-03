import styles from "./CategoryPlaylists.module.css";
import { useLocation } from "react-router-dom";
import PlaylistCategory from "../components/PlaylistCategory/PlaylistCategory";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function CategoryPlaylists() {
  const navigate = useNavigate();
  const location = useLocation();
  const [playlistsCategory, setPlaylistsCategory] = useState([]);
  const [categoryName, setCategoryName] = useState("Category");
  useEffect(() => {
    document.title = "Moodiify | Category Playlists";
  }, []);

  useEffect(() => {
    const { state } = location;
    if (state && state.playlistsCategory && state.categoryName && state.token) {
      setPlaylistsCategory(state.playlistsCategory);
      setCategoryName(state.categoryName);
    }
  }, [location, navigate]);

  return (
    <div className={styles.playlistsContainer}>
      <h1 className={styles.title}>{categoryName} Playlist</h1>

      <div className={styles.playlists}>
        {playlistsCategory.length > 0 &&
          playlistsCategory.map((playlist) => (
            <PlaylistCategory
              playlist={playlist}
              key={playlist.id}
              token={location.state.token}
            />
          ))}
      </div>
    </div>
  );
}

export default CategoryPlaylists;
