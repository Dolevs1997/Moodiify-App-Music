/* eslint-disable react/prop-types */
import styles from "./Search.module.css";
import {
  handleStartRecording,
  handleStopRecording,
} from "../../utils/recording";
import { handleVoiceSearch } from "../../utils/voice_search_song";
import { useNavigate } from "react-router";
export default function Search({
  setFormVisible,
  formVisible,
  isMapVisible,
  setIsMapVisible,
  isRecording,
  setIsRecording,
  userData,
  setSongSuggestions,
  setIsVoiceSearch,
}) {
  const navigate = useNavigate();
  return (
    <div className={styles.searchBar}>
      <span
        onClick={() => {
          setIsRecording(!isRecording);
          if (isRecording) {
            handleStopRecording(userData, setSongSuggestions);
            navigate("/home");
          } else {
            handleStartRecording();
          }
        }}
      >
        <img src="/moodiify/record_i.png" />
      </span>
      <span
        onClick={async () => {
          setIsVoiceSearch(true);
          const response = await handleVoiceSearch(userData);
          if (!response) return;
          console.log("response from voice search:", response);
          setSongSuggestions(response);
          setIsVoiceSearch(false);
          navigate("/home");
        }}
      >
        <img src="/moodiify/mic_i.png" />
      </span>

      <span
        onClick={() => {
          setFormVisible(!formVisible);
          navigate("/home");
        }}
      >
        <img src="/moodiify/chat_i.png" />
      </span>
      <span
        onClick={() => {
          setIsMapVisible(!isMapVisible);
          navigate("/global");
        }}
      >
        <img src="/moodiify/earth_i.png" />
      </span>
    </div>
  );
}
