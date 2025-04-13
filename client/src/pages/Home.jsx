import styles from "./Home.module.css";
import Categories from "../components/Categories/Categories";
import Logo from "../components/Logo/Logo";
import Search from "../components/Search/Search";
import { useEffect, useState } from "react";
import Form from "../components/Form/Form";
import Songs from "../components/Songs/Songs";
import axios from "axios";
import NavBar from "../components/NavBar/NavBar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [formVisible, setFormVisible] = useState(false);
  const [songSuggestions, setSongSuggestions] = useState([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    document.title = "Moodiify | Home";
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setError("User not found. Please login.");
      setIsLoading(false);
      navigate("/login");
    }

    setUserData(JSON.parse(user));

    setIsLoading(false);
  }, [navigate]);
  async function handleVoiceSearch() {
    console.log("Voice search activated");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
      window.SpeechGrammarList || window.webkitSpeechGrammarList;

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

  const handleFormVisible = () => setFormVisible(!formVisible);

  return (
    <main className={styles.homeContainer}>
      <section className={styles.upperSection}>
        <Logo />
        {!isLoading && !error && (
          <Search
            handleFormVisible={handleFormVisible}
            handleVoiceSearch={handleVoiceSearch}
          />
        )}
        <NavBar user={userData} />
      </section>

      {!isLoading && !error && (
        <>
          {formVisible && (
            <Form
              setSongSuggestions={setSongSuggestions}
              handleFormVisible={handleFormVisible}
            />
          )}
          {songSuggestions.length == 0 && <Categories user={userData} />}
          {songSuggestions.length > 0 && (
            <Songs songSuggestions={songSuggestions} user={userData} />
          )}
        </>
      )}
    </main>
  );
}
