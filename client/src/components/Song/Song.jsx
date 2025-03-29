/* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";
import styles from "./Song.module.css";
// import axios from "axios";
// import { fetchVideoSong } from "../../services/YouTube_service";

function Song({ song }) {
  const songName = song.split(" - ")[1];
  const artist = song.split(" - ")[0];
  // const [videoId, setVideoId] = useState("");
  // const [regionCode, setRegionCode] = useState("");
  // const [videoSong, setVideoSong] = useState("");

  // useEffect(
  //   function () {
  //     async function fetchSongRecommendations(artist, songName) {
  //       if (!artist || !songName) return;
  //       try {
  //         const response = await axios.get(
  //           `http://${
  //             import.meta.env.VITE_SERVER_URL
  //           }/moodiify/recommends/?artist=${artist}&songName=${songName}`
  //         );

  //         const data = response.data;
  //         console.log("data", data);
  //         // setVideoId(() => data.items[0].id.videoId);
  //         // setRegionCode(() => data.regionCode);
  //       } catch (error) {
  //         console.error("Error fetching song recommendations:", error);
  //       }
  //     }
  //     fetchSongRecommendations(artist, songName);
  //   },
  //   [artist, songName]
  // );

  // useEffect(
  //   function () {
  //     async function fetchSong() {
  //       console.log("videoId", videoId);
  //       console.log("regionCode", regionCode);
  //       if (videoId !== "" && regionCode !== "") {
  //         const songVideo = await fetchVideoSong(videoId, regionCode);
  //         setVideoSong(songVideo);
  //         setVideoId("");
  //         setRegionCode("");
  //         console.log("songVideo", songVideo);
  //       }
  //     }
  //     fetchSong();
  //   },

  //   [videoId, regionCode, videoSong]
  // );

  return (
    <div className={styles.songContainer}>
      <h2>
        {songName} - {artist}
      </h2>
      <div className={styles.song}></div>

      {/* <div className={styles.song}>
        {videoSong && (
          <iframe
            width="450"
            height="300"
            src={`https://www.youtube.com/embed/${videoSong.items[0].id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoSong.items[0].title}
          ></iframe>
        )}
      </div> */}
    </div>
  );
}

export default Song;
