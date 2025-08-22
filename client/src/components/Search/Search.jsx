/* eslint-disable react/prop-types */
import styles from "./Search.module.css";
import { useState } from "react";
export default function Search({
  handleFormVisible,
  handleVoiceSearch,
  onStartRecording,
  onStopRecording,
}) {
  const [isRecording, setIsRecording] = useState(false);
  return (
    <div className={styles.searchBar}>
      {/* <input className={styles.search} type="text" placeholder={`Search`} /> */}
      {/* <span className={styles.materialIconsOutlined}>
        <img src="/moodiify/search_i.png" />
      </span> */}
      <span
        onClick={() => {
          setIsRecording(!isRecording);
          if (isRecording) {
            onStopRecording();
          } else {
            onStartRecording();
          }
        }}
      >
        <img src="/moodiify/record_i.png" />
      </span>
      <span
        className={styles.materialIconsOutlined}
        onClick={handleVoiceSearch}
      >
        <img src="/moodiify/mic_i.png" />
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
