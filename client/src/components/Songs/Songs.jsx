/* eslint-disable react/prop-types */
import Song from "../Song/Song";
import styles from "./Songs.module.css";
function Songs({ songSuggestions }) {
  return (
    <>
      <h2>Song Suggestions</h2>
      <div>
        <ul className={styles.songsContainer}>
          {songSuggestions.map((song, index) => (
            <Song key={index} song={song} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default Songs;
