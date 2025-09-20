const SongSchema = require("../schemas/Song_schema");
const { addSongVideo } = require("../models/Firestore/songVideo");
const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;

const getAll = async (req, res) => {
  const { artist, songName, country } = req.query;
  console.log("Received query params:", req.query);
  const controller = new AbortController();
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&regionCode=${country}&q=${encodeURIComponent(
    `${artist} ${songName}`
  )}&type=video&key=${API_KEY}
`;
  try {
    if (!artist || !songName) {
      throw new Error("Please provide artist and songName in query params");
    }
    console.log("songName:", songName);
    console.log("artist:", artist);
    const song = await SongSchema.findOne({
      title: songName,
      artist: artist,
    });
    if (song) {
      console.log("Song already exists in the database:", song);
      res.status(200).json(song);
    } else {
      const result = await fetch(url, { signal: controller.signal });
      if (!result.ok) {
        throw new Error("Error fetching data from YouTube API");
      }

      const data = await result.json();
      console.log("Video data:", data.items[0].snippet);
      if (data.items.length === 0) {
        throw new Error("No videos found for the given artist and songName");
      }
      const videoId = data.items[0].id.videoId;
      // await SongSchema.findOne({ videoId: videoId }).then((existingSong) => {
      //   if (existingSong) {
      //     console.log("Song already exists in the database:", existingSong);
      //     return res.status(200).json(existingSong);
      //   }
      // });
      const songVideo = {
        title: data.items[0].snippet.title,
        videoId: videoId,
      };
      await addSongVideo(songVideo);
      const song = new SongSchema({
        title: songName,
        artist: artist,
        videoId: videoId,
        regionCode: data.regionCode || "IL",
      });
      await song.save();
      console.log("Song saved to database:", song);
      res.status(200).json(song);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAll };
