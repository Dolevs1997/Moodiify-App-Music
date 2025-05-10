/* eslint-disable react/prop-types */
import styles from "./Song.module.css";
import { useState } from "react";
// import { useEffect } from "react";
import axios from "axios";
// import { fetchVideoSong } from "../../services/YouTube_service";
import { useNavigate } from "react-router";

function Song({ song, user }) {
  const navigate = useNavigate();
  const songName = song.split(" - ")[1];
  const artist = song.split(" - ")[0];
  const [playlistName, setPlaylistName] = useState("");
  const [options, setOptions] = useState(false);
  // const [videoId, setVideoId] = useState("");
  // const [regionCode, setRegionCode] = useState("");
  // const [videoSong, setVideoSong] = useState("");
  // console.log("videoSong", videoSong);
  if (!user.token) {
    navigate("/login");
  }
  async function handleAddSongToPlaylist(playlistName) {
    console.log("songName", songName);
    console.log("artist", artist);

    if (!playlistName) return;
    try {
      const response = await axios.post(
        `http://${import.meta.env.VITE_SERVER_URL}/moodiify/playlist/create`,
        {
          songName: songName,
          artist: artist,
          playlistName: playlistName,
          user: user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("response", response.data);
      if (response.status === 200) {
        console.log("Song added to playlist successfully!");
        user.playlists.push({
          name: playlistName,
          _id: response.data._id,
        });

        localStorage.setItem("user", JSON.stringify(user));
      }
      setPlaylistName("");
      setOptions(false);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  }
  // useEffect(
  //   function () {
  //     async function fetchSongRecommendations(artist, songName) {
  //       if (!artist || !songName || !user.token) return;
  //       try {
  //         const response = await axios.get(
  //           `http://${
  //             import.meta.env.VITE_SERVER_URL
  //           }/moodiify/recommends/?artist=${artist}&songName=${songName}`,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${user.token}`,
  //             },
  //           }
  //         );

  //         const data = response.data;
  //         console.log("data", data);
  //         setVideoId(() => data.items[0].id.videoId);
  //         setRegionCode(() => data.regionCode);
  //       } catch (error) {
  //         console.error("Error fetching song recommendations:", error);
  //       }
  //     }
  //     fetchSongRecommendations(artist, songName);
  //   },
  //   [artist, songName, user.token]
  // );

  // useEffect(
  //   function () {
  //     async function fetchSong() {
  //       if (videoId !== "" && regionCode !== "") {
  //         const songVideo = await fetchVideoSong(
  //           videoId,
  //           regionCode,
  //           user.token
  //         );
  //         setVideoSong(songVideo);
  //         setVideoId("");
  //         setRegionCode("");
  //         console.log("songVideo", songVideo);
  //       }
  //     }
  //     fetchSong();
  //   },

  //   [videoId, regionCode, videoSong, user.token]
  // );

  return (
    <div className="homeContainer">
      <span
        className={styles.addBtn}
        onClick={() => setOptions((prev) => !prev, console.log("user", user))}
      >
        ➕
      </span>
      <h2>
        {artist} - {songName}
      </h2>
      {options && (
        <div className={styles.playlistOptions}>
          <select>
            <option value="">Select Playlist</option>
            {user.playlists.length > 0 ? (
              user.playlists.map((playlist) => (
                <option key={playlist._id} value={playlist.name}>
                  {playlist.name}
                </option>
              ))
            ) : (
              <option value="">No Playlists</option>
            )}
          </select>
          <input
            type="text"
            placeholder="Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button onClick={() => handleAddSongToPlaylist(playlistName)}>
            Add Song
          </button>
          <button onClick={() => setPlaylistName("")}>
            Clear Playlist Name
          </button>
        </div>
      )}
      <div className={styles.song}>
        {/* {videoSong && (
          <iframe
            width="450"
            height="300"
            src={`https://www.youtube.com/embed/${videoSong.items[0].id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={videoSong.items[0].title}
          ></iframe>
        )} */}
      </div>
    </div>
  );
}

export default Song;
