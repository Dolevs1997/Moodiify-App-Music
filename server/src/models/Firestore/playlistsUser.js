import {
  addDoc,
  collection,
  arrayUnion,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase_config.js";
import { addSongsUser, getSongUser } from "./songsUser.js"; // Import the function to add songs user
const addPlaylistsUser = async (newPlaylist, newSong, userRef) => {
  console.log("Converted user:", newPlaylist.user.toString());
  // console.log(
  //   "Converted songs:",
  //   newPlaylist.songs.map((id) => id.toString())
  // );

  try {
    // Check if the user reference is valid
    if (!userRef || !userRef.id) {
      console.error("Invalid user reference provided:", userRef);
      return { error: "Invalid user reference" };
    }
    // Check if the song already exists for the user
    const existingSong = await getSongUser(
      newSong.title,
      newSong.artist,
      userRef.id
    );
    if (existingSong) {
      console.log("Song already exists for this user:", existingSong);
      newSong = existingSong; // Use the existing song
    } else {
      console.log("Adding new song for user:", newSong);
      const newSongRef = await addSongsUser(newSong);
      newSong = newSongRef; // Use the reference of the new song
    }
    const docRef = await addDoc(collection(db, "playlists-user"), {
      name: newPlaylist.name,
      user: userRef,
      songs: arrayUnion(newSong), // Use the ID of the new song
    });
    console.log("Playlist user added with ID: ", docRef.id);

    return docRef; // Return the document reference or ID
  } catch (error) {
    console.error("Error adding playlist user:", error);
  }
};

const getPlaylistUser = async (playlistName, userRef) => {
  console.log("Getting playlist user with name:", playlistName);
  // console.log("User ID:", userRef.user.toString());
  console.log("User reference:", userRef._key);
  console.log("User reference (string):", userRef._key.toString());
  try {
    const playlistQuery = query(
      collection(db, "playlists-user"),
      where("name", "==", playlistName),
      where("user", "==", userRef._key.toString()) // Query to find playlist by name and user ID
    );
    const querySnapshot = await getDocs(playlistQuery);
    if (querySnapshot.empty) {
      console.log(
        "No playlist found with this name for the user:",
        playlistName
      );
      return null; // Return null if no playlist is found
    }
    let playlistData = null;
    querySnapshot.forEach((doc) => {
      console.log("Found playlist user:", doc.id, doc.data());
      playlistData = { id: doc.id, ...doc.data() };
    });
    return playlistData;
  } catch (error) {
    console.error("Error getting playlist user:", error);
    return { error: "Error getting playlist user" };
  }
};

export { addPlaylistsUser, getPlaylistUser };
