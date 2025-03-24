const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;
const getAll = async (req, res) => {
  console.log("query", req.query);
  const { artist, songName } = req.query;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    `${artist} ${songName}`
  )}&type=video&key=${API_KEY}`;
  console.log("url", url);
  try {
    if (!artist || !songName) {
      throw new Error("Please provide artist and songName in query params");
    }
    const result = await fetch(url);
    const data = await result.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAll };
