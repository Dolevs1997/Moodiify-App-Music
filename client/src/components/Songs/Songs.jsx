/* eslint-disable react/prop-types */
import Song from "../Song/Song";
import styles from "./Songs.module.css";
function Songs({ songSuggestions, user }) {
  return (
    <div>
      {songSuggestions.length > 1 ? (
        <>
          <h2>Song Suggestions</h2>
          <ul className={styles.songsContainer}>
            {songSuggestions.map((song, index) => (
              <Song key={index} song={song} user={user} />
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>Song Record Audio</h2>
          <Song song={songSuggestions[0]} user={user} />
        </>
      )}
    </div>
  );
}

export default Songs;
