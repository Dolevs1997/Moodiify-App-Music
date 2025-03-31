/* eslint-disable react/prop-types */
import styles from "./Search.module.css";
export default function Search({ handleFormVisible, handleVoiceSearch }) {
  return (
    <div className={styles.searchBar}>
      <input className={styles.search} type="text" placeholder={`Search`} />
      <span className={styles.materialIconsOutlined}>
        <img src="/moodiify/search_i.png" />
      </span>
      <span className={styles.materialSymbolsOutlined}>
        <img src="/moodiify/genres_i.png" />
      </span>
      <span
        className={styles.materialIconsOutlined}
        onClick={handleVoiceSearch}
      >
        <img src="/moodiify/mic_i.png" />
      </span>
      <span className={styles.materialIconsOutlined}>
        <img src="/moodiify/image_i.png" />
      </span>
      <span
        className={styles.materialSymbolsOutlined}
        onClick={handleFormVisible}
      >
        <img src="/moodiify/chat_i.png" />
      </span>
    </div>
  );
}
