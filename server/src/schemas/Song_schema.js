const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: false,
  },
  regionCode: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Song", SongSchema);
