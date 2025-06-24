/* eslint-disable react/prop-types */
import Song from "../Song/Song";
import styles from "./Songs.module.css";
function Songs({ songSuggestions, user }) {
  return (
    <div>
      {songSuggestions.length > 1 ? (
        <div className={styles.boxSongs}>
          <h2>Song Suggestions</h2>
          <ul>
            {songSuggestions.map((song, index) => (
              <Song key={index} song={song} user={user} />
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.boxSongs}>
          <h2>Song Record Audio</h2>
          <Song song={songSuggestions[0]} user={user} />
        </div>
      )}
    </div>
  );
}

export default Songs;
