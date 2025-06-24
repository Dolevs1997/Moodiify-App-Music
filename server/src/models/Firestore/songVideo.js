import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase_config.js";

const addSongVideo = async (songVideo) => {
  try {
    const docRef = await addDoc(collection(db, "song-video"), {
      title: songVideo.title,
      videoId: songVideo.videoId,
    });
    console.log("Song video added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding song video:", error);
  }
};

// const updateSongVideo = async (songVideoId, updatedData) => {
//   try {
//     const docRef = doc(db, "song-video", songVideoId);
//     await updateDoc(docRef, updatedData);
//     console.log("Song video updated with ID: ", songVideoId);
//   } catch (error) {
//     console.error("Error updating song video:", error);
//   }
// };

export { addSongVideo };
