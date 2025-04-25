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
import startRecognition from "../utils/recognization_song";
let mediaRecorder;
let audioChunks = [];
export default function Home() {
  const [formVisible, setFormVisible] = useState(false);
  const [songSuggestions, setSongSuggestions] = useState([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
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
    const recognition = startRecognition();

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

  async function startRecording() {
    console.log("Recording started");
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.start();
  }
  function stopRecording() {
    mediaRecorder.stop();

    mediaRecorder.onstop = async () => {
      setIsRecording(false);
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", audioBlob, "sample.wav");
      console.log("Recording stopped");
      // console.log("Sending audio file to server...");
      // console.log("Audio file:", audioBlob);
      // console.log("Form data:", formData.get("file"));
      // console.log("User token:", userData.token);
      // console.log("Server URL:", import.meta.env.VITE_SERVER_URL);
      const res = await fetch(
        `http://${
          import.meta.env.VITE_SERVER_URL
        }/moodiify/videoSong/recognize-audio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log(data);
      if (data.error) {
        console.error("Error:", data.error);
        return;
      }

      setSongSuggestions([
        data.metadata.music[0].artists[0].name +
          " - " +
          data.metadata.music[0].title,
      ]);
      console.log("Recognized text:", data.metadata.music[0].title);
      console.log("Recognized text:", data.metadata.music[0].artists[0].name);
      console.log(songSuggestions);
      // setSongSuggestions([
      //   data.metadata.music.artists[0].name + " - " + data.metadata.music.album,
      // ]);

      // show song info or video
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
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
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
          {songSuggestions.length > 0 && isRecording === false && (
            <Songs songSuggestions={songSuggestions} user={userData} />
          )}
        </>
      )}
    </main>
  );
}
