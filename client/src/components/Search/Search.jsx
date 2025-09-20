/* eslint-disable react/prop-types */
import styles from "./Search.module.css";
import { useState } from "react";
export default function Search({
  handleFormVisible,
  handleVoiceSearch,
  handleStartRecording,
  handleStopRecording,
  isMapVisible,
  setIsMapVisible,
}) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className={styles.searchBar}>
      <span
        onClick={() => {
          setIsRecording(!isRecording);
          if (isRecording) {
            handleStopRecording();
          } else {
            handleStartRecording();
          }
        }}
      >
        <img src="/moodiify/record_i.png" />
      </span>
      <span onClick={handleVoiceSearch}>
        <img src="/moodiify/mic_i.png" />
      </span>

      <span onClick={handleFormVisible}>
        <img src="/moodiify/chat_i.png" />
      </span>
      <span onClick={() => setIsMapVisible(!isMapVisible)}>
        <img src="/moodiify/earth_i.png" />
      </span>
    </div>
  );
}
