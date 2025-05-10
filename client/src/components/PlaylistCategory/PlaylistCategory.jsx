/* eslint-disable react/prop-types */
import styles from "./PlaylistCategory.module.css";
import { useNavigate } from "react-router";

function PlaylistCategory({ playlist, token }) {
  const navigate = useNavigate();
  return (
    <div
      className={styles.playlist}
      onClick={() =>
        navigate(`/category/playlists/${playlist.id}/songs`, {
          state: {
            playlistName: playlist.title,
            token: token,
          },
        })
      }
    >
      <h3 className={styles.playlistTitle}>{playlist.title}</h3>

      <img
        className={styles.playlistImage}
        src={playlist.thumbnail}
        alt={playlist.image}
      />
    </div>
  );
}

export default PlaylistCategory;
