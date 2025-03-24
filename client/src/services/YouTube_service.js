import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const fetchVideoSong = async (videoId, regionCode) => {
  try {
    const response = await axios.get(
      `http://${SERVER_URL}/moodiify/videoSong/?videoId=${videoId}&regionCode=${regionCode}`
    );
    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error fetching video song:", error);
    throw error;
  }
};

export { fetchVideoSong };
