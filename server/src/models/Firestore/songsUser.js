import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase_config.js";

const addSongsUser = async (songUser, userRef) => {
  const existingSong = await getSongUser(
    songUser.title,
    songUser.artist,
    userRef
  );
  if (existingSong) {
    return existingSong; // Return the existing song if it already exists
  }
  try {
    const docRef = await addDoc(collection(db, "songs-user"), {
      artist: songUser.artist,
      title: songUser.title,
      user: userRef, // Store the user reference
    });

    console.log("New song added to user:", {
      id: docRef.id,
      artist: songUser.artist,
      title: songUser.title,
      user: userRef,
    });

    return docRef;
  } catch (error) {
    console.error("Error adding songs user:", error);
  }
};

const getSongUser = async (songName, artist, userRef) => {
  try {
    const songQuery = query(
      collection(db, "songs-user"),
      where("title", "==", songName),
      where("artist", "==", artist),
      where("user", "==", userRef) // Query to find song by name, artist, and user ID
    );
    const querySnapshot = await getDocs(songQuery);
    if (querySnapshot.empty) {
      console.log("No song found with this name for the user:", songName);
      return null; // Return null if no song is found
    }
    const existingSongRef = querySnapshot.docs[0].ref; // Get the first document reference
    return existingSongRef; // Return the document reference of the existing song

    // let songData = null;
    // querySnapshot.forEach((doc) => {
    //   songData = { id: doc.id, ...doc.data() };
    // });
    // return songData;
  } catch (error) {
    console.error("Error getting song user:", error);
    return { error: "Error getting song user" };
  }
};

export { addSongsUser, getSongUser };
