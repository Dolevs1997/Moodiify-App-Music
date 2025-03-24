const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;

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

module.exports = { getById };
