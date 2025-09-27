/* eslint-disable react/prop-types */
import styles from "./Search.module.css";
import {
  handleStartRecording,
  handleStopRecording,
} from "../../utils/recording";
import voiceSearchSong from "../../utils/voice_search_song";
import axios from "axios";
export default function Search({
  handleFormVisible,
  isMapVisible,
  setIsMapVisible,
  isRecording,
  setIsRecording,
  userData,
  setSongSuggestions,
  setFormVisible,
}) {
  async function handleVoiceSearch() {
    console.log("Voice search activated");
    const recognition = voiceSearchSong();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Recognized text:", transcript);
      const payload = {
        text: transcript,
        role: "user",
      };
      setFormVisible(false);
      setSongSuggestions([]);

      try {
        const response = await axios.post(
          `http://${import.meta.env.VITE_SERVER_URL}/api/openai`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        setSongSuggestions(response.data);
        console.log("response: \n", response.data);
      } catch (error) {
        console.error("Error fetching song suggestions:", error);
      } finally {
        recognition.stop();
      }
    };
  }
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
