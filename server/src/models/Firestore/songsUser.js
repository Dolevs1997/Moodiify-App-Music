import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase_config.js";

const addSongsUser = async (songUser) => {
  console.log("Adding songs user in songsUser.js:", songUser);
  try {
    const docRef = await addDoc(collection(db, "songs-user"), {
      artist: songUser.artist,
      title: songUser.title,
    });
    console.log("Songs user added with ID: ", docRef.id);
    return docRef; // Return the document reference or ID
  } catch (error) {
    console.error("Error adding songs user:", error);
  }
};

const getSongUser = async (songName, artist, userId) => {
  try {
    const songQuery = query(
      collection(db, "songs-user"),
      where("title", "==", songName),
      where("artist", "==", artist),
      where("user", "==", userId) // Query to find song by name, artist, and user ID
    );
    const querySnapshot = await getDocs(songQuery);
    if (querySnapshot.empty) {
      console.log("No song found with this name for the user:", songName);
      return null; // Return null if no song is found
    }
    let songData = null;
    querySnapshot.forEach((doc) => {
      songData = { id: doc.id, ...doc.data() };
    });
    return songData;
  } catch (error) {
    console.error("Error getting song user:", error);
    return { error: "Error getting song user" };
  }
};

export { addSongsUser, getSongUser };
