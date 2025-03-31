import Categories from "../components/Categories/Categories";
import NavBar from "../components/NavBar/NavBar";
import { useState } from "react";
import Form from "../components/Form/Form";
import Songs from "../components/Songs/Songs";
import axios from "axios";
export default function Home() {
  const [formVisible, setFormVisible] = useState(false);
  const [songSuggestions, setSongSuggestions] = useState([]);

  async function handleVoiceSearch() {
    console.log("Voice search activated");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
      window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent =
      window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;
    recognition.start();

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

  const handleFormVisible = () => setFormVisible(!formVisible);

  return (
    <main className="homePage">
      <NavBar
        handleFormVisible={handleFormVisible}
        handleVoiceSearch={handleVoiceSearch}
      />
      {formVisible && (
        <Form
          setSongSuggestions={setSongSuggestions}
          handleFormVisible={handleFormVisible}
        />
      )}
      {songSuggestions.length == 0 && <Categories />}
      {songSuggestions.length > 0 && (
        <Songs songSuggestions={songSuggestions} />
      )}
    </main>
  );
}
