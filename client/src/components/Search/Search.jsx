import styles from "./Search.module.css";
export default function Search() {
  return (
    <div className={styles.searchBar}>
      <input className={styles.search} type="text" placeholder={`Search`} />
      <span className={styles.materialIconsOutlined}>
        <img src="public/search_i.png" />
      </span>
      <span className={styles.materialSymbolsOutlined}>
        <img src="public/genres_i.png" />
      </span>
      <span className={styles.materialIconsOutlined}>
        <img src="public/mic_i.png" />
      </span>
      <span className={styles.materialIconsOutlined}>
        <img src="public/image_i.png" />
      </span>
      <span className={styles.materialSymbolsOutlined}>
        <img src="public/chat_i.png" />
      </span>
    </div>
  );
}
