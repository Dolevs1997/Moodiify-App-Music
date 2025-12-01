const PlaylistSchema = require("../schemas/Playlist_schema");
const UserSchema = require("../schemas/User_schema");
const SongSchema = require("../schemas/Song_schema");
const { updateUser, getUser } = require("../models/Firestore/user");
const { getPlaylistUser } = require("../models/Firestore/playlistsUser");

const createPlaylist = async (req, res) => {
  const { song, playlistName, user, videoId } = req.body;
  console.log("song", song);
  console.log("song videoId:", videoId);
  console.log("user", user);
  let newSong = null;
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

    if (existingPlaylist) {
      // console.log("Adding song to existing playlist:", playlistName);
      // Check if the song already exists
      const existingSong = await SongSchema.findOne({
        song: song,
      });
      if (!existingSong) {
        // Create a new song if it doesn't exist
        newSong = new SongSchema({
          song: song,
          videoId: videoId,
        });
        await newSong.save();
        // console.log("New song created:", newSong);
      } else {
        newSong = existingSong;
        // console.log("Using existing song:", newSong);
      }
      // If the playlist already exists, add the song to the existing playlist
      if (!existingPlaylist.songs.includes(newSong._id)) {
        console.log(
          "Song is not in playlist, adding song to existing playlist"
        );
        existingPlaylist.songs.push(newSong);
        console.log("Existing playlist before saving:", existingPlaylist.songs);
        await existingPlaylist.save();
        console.log("Existing playlist after saving:", existingPlaylist.songs);
      }
    }
    // If the playlist does not exist, create a new one
    else if (!existingPlaylist) {
      // console.log("Creating new playlist:", playlistName);
      // Check if the song already exists
      const existingSong = await SongSchema.findOne({
        song: song,
        videoId: videoId,
      });

      if (!existingSong) {
        // Create a new song if it doesn't exist
        newSong = new SongSchema({
          song: song,
          videoId: videoId,
        });
        await newSong.save();
        // console.log("New song created:", newSong);
      } else {
        newSong = existingSong;
        // console.log("Using existing song:", newSong);
      }

      // Create a new playlist
      newPlaylist = new PlaylistSchema({
        name: playlistName,
        user: userId,
        songs: [newSong._id],
      });
      await newPlaylist.save();
      // console.log("New playlist created:", newPlaylist);
      // Add the playlist to the user's playlists
      existingUser.playlists.push(newPlaylist._id); // Add the new playlist to the user's playlists
      console.log(
        "User's playlists after adding new playlist:",
        existingUser.playlists
      );
      await existingUser.save();
    }

    // console.log("new songs:", newSong);

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
  console.log("Request query ID:", req.query.id);

  const playlistId = req.query.id;
  try {
    const playlistObject = await PlaylistSchema.findById(playlistId);
    // console.log("Playlist object:", playlistObject);
    if (!playlistObject) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const userId = playlistObject.user;
    const userObject = await UserSchema.findById(userId);
    // console.log("User object:", userObject);
    if (!userObject) {
      return res.status(404).json({ message: "User not found" });
    }
    const userEmail = userObject.email;
    const playlistName = playlistObject.name;
    const userRef = await getUser(userEmail);
    if (!userRef || userRef.error) {
      console.error("Error retrieving user from Firestore:", userRef.error);
      return res.status(500).json({ message: "Error retrieving user data" });
    }
    // console.log("User reference from Firestore:", userRef);
    const firestorePlaylist = await getPlaylistUser(playlistName, userRef);
    if (!firestorePlaylist || firestorePlaylist.error) {
      console.error(
        "Error retrieving playlist from Firestore:",
        firestorePlaylist.error
      );
      return res
        .status(500)
        .json({ message: "Error retrieving playlist data" });
    }
    // console.log("Firestore playlist:", firestorePlaylist);
    const playlist = await PlaylistSchema.findById(playlistId).populate(
      "songs"
    );
    console.log("Playlist with populated songs:", playlist);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const songs = playlist.songs;
    res.status(200).json({ songs: songs });
  } catch (error) {
    console.error("Error getting playlist songs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPlaylist,
  getPlaylistSongs,
};
