import Song from "../Song/Song";
import styles from "./Songs.module.css";
import { useState } from "react";
import propTypes from "prop-types";
function Songs({ songSuggestions, user }) {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  return (
    <div>
      {songSuggestions.length > 1 ? (
        <div className={styles.boxSongs}>
          <h2>Song Suggestions</h2>
          <ul>
            {songSuggestions.map((song, index) => (
              <Song
                key={index}
                song={song}
                user={user}
                playingVideoId={playingVideoId}
                setPlayingVideoId={setPlayingVideoId}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.boxSongs}>
          <h2>Song Record Audio</h2>
          <Song
            song={songSuggestions[0]}
            user={user}
            playingVideoId={playingVideoId}
            setPlayingVideoId={setPlayingVideoId}
          />
        </div>
      )}
    </div>
  );
}
Songs.propTypes = {
  songSuggestions: propTypes.arrayOf(propTypes.string.isRequired).isRequired,
  user: propTypes.shape({
    token: propTypes.string.isRequired,
    playlists: propTypes.arrayOf(
      propTypes.shape({
        _id: propTypes.string,
        name: propTypes.string,
      })
    ),
  }).isRequired,
};

export default Songs;
