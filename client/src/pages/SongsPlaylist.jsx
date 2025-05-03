// import styles from "./SongsPlaylist.module.css";
import { useParams, useLocation } from "react-router";
import { useEffect, useState } from "react";
import styles from "../components/Songs/Songs.module.css";
import Song from "../components/Song/Song";
// import NavBar from "../components/NavBar/NavBar";
// import Logo from "../components/Logo/Logo";
// import Search from "../components/Search/Search";
// import { useNavigate } from "react-router-dom";
function SongsPlaylist() {
  const { playlistId } = useParams();
  const location = useLocation();
  const { playlistName, token } = location.state || {};
  const [playlist, setPlaylist] = useState([]);
  // const user = JSON.parse(localStorage.getItem("user"));
  console.log("Playlist data:", playlist);
  console.log("Playlist ID:", playlistId);
  console.log("Playlist Name:", playlistName);
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(
          `http://${
            import.meta.env.VITE_SERVER_URL
          }/moodiify/videoSong/playlist/?id=${playlistId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPlaylist(data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchPlaylist();
  }, [playlistId, token]);
  return (
    <div>
      <h2>{playlistName}</h2>
      <div className="playlist-songs">
        {playlist.length > 0 ? (
          <ul className={styles.songsContainer}>
            {playlist.map((song, index) => (
              <Song
                key={index}
                song={song.title}
                user={JSON.parse(localStorage.getItem("user"))}
              />
            ))}
          </ul>
        ) : (
          <p>No songs found in this playlist.</p>
        )}
      </div>
    </div>
  );
}

export default SongsPlaylist;
