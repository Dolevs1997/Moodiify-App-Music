// import styles from "./SongsPlaylist.module.css";
import { useParams, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Song from "../../components/Song/Song";
import Logo from "../../components/Logo/Logo";
import Search from "../../components/Search/Search";
import NavBar from "../../components/NavBar/NavBar";
// import { useNavigate } from "react-router-dom";
function SongsPlaylist() {
  const { playlistId } = useParams();
  const location = useLocation();
  const { playlistName } = location.state || {};
  const [playlist, setPlaylist] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  // console.log("playlist", playlist);
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
              Authorization: `Bearer ${user.token}`,
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
  }, [playlistId, user]);
  return (
    <main className="homeContainer">
      <div className="header">
        <Logo />
        <Search />
        <NavBar user={user} />
      </div>
      <h2>{playlistName}</h2>
      <div className="playlist-songs">
        {playlist.length > 0 ? (
          <ul className="songsContainer">
            {playlist
              .filter((song) => song.title.includes("-"))
              .map((song, index) => (
                <Song song={song.title} user={user} key={index} />
              ))}
          </ul>
        ) : (
          <p>No songs found in this playlist.</p>
        )}
      </div>
    </main>
  );
}

export default SongsPlaylist;
