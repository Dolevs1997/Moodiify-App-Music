/* eslint-disable react/prop-types */
import Song from "../Song/Song";
import styles from "./Songs.module.css";
function Songs({ songSuggestions }) {
  return (
    <section className={styles.songs}>
      <h2>Song Suggestions</h2>
      <ul>
        {songSuggestions.map((song, index) => (
          <Song key={index} song={song} />
        ))}
      </ul>
    </section>
  );
}

export default Songs;
