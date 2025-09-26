/* eslint-disable react/prop-types */
import styles from "./Search.module.css";
import {
  handleStartRecording,
  handleStopRecording,
} from "../../utils/recording";
export default function Search({
  handleFormVisible,
  handleVoiceSearch,
  isMapVisible,
  setIsMapVisible,
  isRecording,
  setIsRecording,
  userData,
  setSongSuggestions,
}) {
  return (
    <div className={styles.searchBar}>
      <span
        onClick={() => {
          setIsRecording(!isRecording);
          console.log(isRecording);
          if (isRecording) {
            handleStopRecording(userData, setSongSuggestions);
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
