const PlaylistSchema = require("../schemas/Playlist_schema");
const UserSchema = require("../schemas/User_schema");
const SongSchema = require("../schemas/Song_schema");
const createPlaylist = async (req, res) => {
  const { songName, artist, playlistName, user } = req.body;
  console.log("request body:", req.body);
  // console.log("Creating playlist with title:", songName);
  // console.log("Creating playlist with artist:", artist);
  // console.log("Creating playlist with playlistName:", playlistName);
  // console.log("Creating playlist with user:", user);
  try {
    const userId = user._id; // Assuming you have the user ID from the authentication middleware

    // Check if the user exists
    const existingUser = await UserSchema.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the playlist already exists for the user
    const existingPlaylist = await PlaylistSchema.findOne({
      name: playlistName,
      user: userId,
    });
    if (existingPlaylist) {
      return res.status(400).json({ message: "Playlist already exists" });
    }

    const existingSong = await SongSchema.findOne({
      title: songName,
      artist: artist,
    });
    if (existingSong) {
      return res.status(400).json({ message: "Song already exists" });
    }
    // Create a new song
    const newSong = new SongSchema({
      title: songName,
      artist: artist,
    });
    await newSong.save();

    // Create a new playlist
    const newPlaylist = new PlaylistSchema({
      name: playlistName,
      user: userId,
      songs: [newSong._id], // Add the song to the playlist
    });
    await newPlaylist.save();

    // Add the playlist to the user's playlists
    existingUser.playlists.push(newPlaylist);
    await existingUser.save();
    console.log("User updated with new playlist:", existingUser);
    console.log("name playlist:", newPlaylist.name);
    return res.status(201).json({
      message: "Playlist created successfully",
      playlist: newPlaylist.name,
      id: newPlaylist._id,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPlaylist,
};
