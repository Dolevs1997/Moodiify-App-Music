const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;
const { identify } = require("../services/MusicRecognition_service"); // assuming you move acr helper to utils
const defaultOptions = require("../config/acr_config"); // your ACRCloud keys
const getById = async (req, res) => {
  console.log("query", req.query);
  const { videoId, regionCode } = req.query;
  if (!videoId) {
    return res
      .status(400)
      .json({ error: "Please provide videoId in query params" });
  }
  const result = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&regionCode=${regionCode}&key=${API_KEY}`
  );
  const data = await result.json();
  res.status(200).json(data);
};

const recognizeAudio = async (req, res) => {
  console.log("Recognizing audio...");
  console.log("Request file:", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "Audio file missing" });
  }
  const audioBuffer = req.file?.buffer;
  console.log("Audio buffer:", audioBuffer);
  if (!audioBuffer) {
    return res.status(400).json({ error: "Audio file missing" });
  }

  identify(audioBuffer, defaultOptions.default, (err, httpResponse, body) => {
    if (err) {
      console.error("ACRCloud error:", err);
      return res.status(500).json({ error: "Audio recognition failed" });
    }

    try {
      const result = JSON.parse(body);
      return res.status(200).json(result);
    } catch (e) {
      console.error("Failed to parse ACRCloud response:", e);
      return res
        .status(500)
        .json({ error: "Unexpected response from ACRCloud" });
    }
  });
};

module.exports = { getById, recognizeAudio };
