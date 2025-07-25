import { useParams } from "react-router";
import { useEffect } from "react";
import Logo from "../../components/Logo/Logo";
import Search from "../../components/Search/Search";
import NavBar from "../../components/NavBar/NavBar";
import styles from "./SongsPlaylistUser.module.css";
import { useLocation } from "react-router";
import PropTypes from "prop-types";

SongsPlaylistUser.propTypes = {
  user: PropTypes.object,
  playlist: PropTypes.object,
};

function SongsPlaylistUser() {
  const { playlistId } = useParams();
  const location = useLocation();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  let playlist =
    location.state?.playlist ||
    user?.playlists?.find((p) => p.id === playlistId);
  const songs = playlist?.songs || [];

  if (!playlist) {
    console.error("Playlist not found for ID:", playlistId);
    console.log("playlist", playlist);
  }
  if (!user) {
    console.error("User not found in local storage or state.");
  }
  console.log("user", user);
  console.log("playlist", playlist);
  console.log("songs", songs);

  useEffect(() => {
    async function fetchPlaylistSongs() {
      try {
        const response = await fetch(
          `http://${
            import.meta.env.VITE_SERVER_URL
          }/moodiify/playlist/?id=${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch playlist songs");
        }
        const data = await response.json();
        console.log("Fetched playlist songs:", data);
      } catch (error) {
        console.error("Error fetching playlist songs:", error);
      }
    }
    fetchPlaylistSongs();
  }, [playlistId, user.token]);
  return (
    <div className={styles.container}>
      <section className="header">
        <Logo />
        <Search />
        <NavBar user={user} />
      </section>
      <h1>{playlist.name} Playlist</h1>
      <div>
        {songs.map((song, index) => (
          <div key={index}>
            <h2>{song.title}</h2>
            <p>{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SongsPlaylistUser;
