import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Logo from "../../components/Logo/Logo";
import Search from "../../components/Search/Search";
import NavBar from "../../components/NavBar/NavBar";
import Song from "../../components/Song/Song";
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
  const [songs, setSongs] = useState([]);
  if (!playlist) {
    console.error("Playlist not found for ID:", playlistId);
  }
  if (!user) {
    console.error("User not found in local storage or state.");
  }
  console.log("playlist", playlist);

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
          setSongs([]);
          throw new Error("Failed to fetch playlist songs");
        }
        const data = await response.json();
        setSongs(data.songs || []);
      } catch (error) {
        console.error("Error fetching playlist songs:", error);
      }
    }
    fetchPlaylistSongs();
  }, [playlistId, user.token, songs.length]);
  return (
    <div className={styles.container}>
      <section className="header">
        <Logo />
        <Search />
        <NavBar user={user} />
      </section>
      <h1>{playlist.name} Playlist</h1>
      {songs.length > 0 ? (
        <div className={styles.songsList}>
          {songs.map((song, index) => (
            <Song
              key={index}
              song={song.artist + " - " + song.title}
              user={user}
              playingVideoId={null}
              setPlayingVideoId={() => {}}
              playlistId={playlist._id}
            />
          ))}
        </div>
      ) : (
        <p>No songs found in this playlist.</p>
      )}
    </div>
  );
}

export default SongsPlaylistUser;
