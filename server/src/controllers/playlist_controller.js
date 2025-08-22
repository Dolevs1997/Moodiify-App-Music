const PlaylistSchema = require("../schemas/Playlist_schema");
const UserSchema = require("../schemas/User_schema");
const SongSchema = require("../schemas/Song_schema");
const { updateUser } = require("../models/Firestore/user");

const createPlaylist = async (req, res) => {
  const { songName, artist, playlistName, user } = req.body;
  try {
    const userId = user._id; // Assuming you have the user ID from the authentication middleware
    let newPlaylist;

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

    // Check if the song already exists for the user
    const existingSong = await SongSchema.findOne({
      title: songName,
      artist: artist,
    });
    console.log("Existing song :", existingSong);
    let newSong;
    if (!existingSong) {
      // Create a new song if it doesn't exist
      newSong = new SongSchema({
        title: songName,
        artist: artist,
      });
      await newSong.save();
    }
    console.log("New song :", newSong);
    // If the song already exists, use the existing song
    if (existingSong) {
      newSong = existingSong; // Use the existing song
    }
    // Create a new playlist
    if (existingPlaylist) {
      console.log("Adding song to existing playlist:", playlistName);
      // If the playlist already exists, add the song to the existing playlist
      if (!existingPlaylist.songs.includes(newSong._id)) {
        console.log(
          "Song not already in playlist, adding song to existing playlist"
        );
        existingPlaylist.songs.push(newSong._id);
        console.log("Existing playlist before saving:", existingPlaylist.songs);
        await existingPlaylist.save();
        console.log("Existing playlist after saving:", existingPlaylist.songs);
      }
    }
    // If the playlist does not exist, create a new one
    else if (!existingPlaylist) {
      console.log("Creating new playlist:", playlistName);

      // Create a new playlist
      newPlaylist = new PlaylistSchema({
        name: playlistName,
        user: userId,
        songs: [newSong._id], // Add the song to the new playlist
      });
      await newPlaylist.save();
      console.log("New playlist created:", newPlaylist);
      // Add the playlist to the user's playlists
      existingUser.playlists.push(newPlaylist._id); // Add the new playlist to the user's playlists
      console.log(
        "User's playlists after adding new playlist:",
        existingUser.playlists
      );
      await existingUser.save();
    }

    ///////////////////////////////////
    const firestoreUpdate = await updateUser(
      existingUser.email,
      { name: playlistName, user: userId },
      newSong
    );
    if (firestoreUpdate.error) {
      console.error("Error updating user in Firestore:", firestoreUpdate.error);
      return res
        .status(500)
        .json({ message: "Error updating user in Firestore" });
    }
    const playlist = existingPlaylist ? existingPlaylist : newPlaylist;
    console.log("Playlist after update:", playlist);
    return res.status(200).json({
      message: "Song added to existing playlist successfully",
      playlist: playlist,
    });
  } catch (error) {
    console.error("Error creating playlist in playlist_controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPlaylistSongs = async (req, res) => {
  console.log("Getting playlist songs");
  console.log("Request query:", req.query);
  console.log("Request query ID:", req.query.id);

  const playlistId = req.query.id;
  console.log("Playlist ID:", playlistId);
  try {
    const playlist = await PlaylistSchema.findById(playlistId).populate(
      "songs"
    );
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(playlist.songs);
  } catch (error) {
    console.error("Error getting playlist songs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPlaylist,
  getPlaylistSongs,
};
