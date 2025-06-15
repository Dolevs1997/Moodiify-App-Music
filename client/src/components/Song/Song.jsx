/* eslint-disable react/prop-types */
import styles from "./Song.module.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { fetchVideoSong } from "../../services/YouTube_service";
import { useNavigate } from "react-router";
import Button from "../Button/Button";
function Song({ song, user }) {
  const navigate = useNavigate();
  const songName = song.split(" - ")[1];
  const artist = song.split(" - ")[0];
  const [playlistName, setPlaylistName] = useState("");
  const [options, setOptions] = useState(false);

  const [videoId, setVideoId] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [videoSong, setVideoSong] = useState("");
  //console.log("user", user);

  // console.log("videoSong", videoSong);

  if (!user.token) {
    navigate("/login");
  }
  if (!user.playlists) {
    user.playlists = [];
  }

  async function handleAddSongToPlaylist(playlistName) {
    console.log("songName", songName);
    console.log("artist", artist);

    console.log("playlistName", playlistName);
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
      console.log("playlist name", response.data.playlist);

      console.log("Song added to playlist successfully!");
      if (!Array.isArray(user.playlists)) {
        user.playlists = [];
      }
      user.playlists.push({
        id: response.data.id,
        name: response.data.playlist,
      });

      console.log("Updated user playlists:", user.playlists);
      localStorage.setItem("user", JSON.stringify(user));
      setPlaylistName("");
      setOptions(false);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  }
  useEffect(
    function () {
      async function fetchSongRecommendations(artist, songName) {
        if (!artist || !songName || !user.token) return;
        try {
          const response = await axios.get(
            `http://${
              import.meta.env.VITE_SERVER_URL
            }/moodiify/recommends/?artist=${artist}&songName=${songName}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          const data = response.data;
          console.log("data", data);
          setVideoId(() => data.items[0].id.videoId);
          setRegionCode(() => data.regionCode);
        } catch (error) {
          console.error("Error fetching song recommendations:", error);
        }
      }
      fetchSongRecommendations(artist, songName);
    },
    [artist, songName, user.token]
  );

  useEffect(
    function () {
      async function fetchSong() {
        if (videoId !== "" && regionCode !== "") {
          const songVideo = await fetchVideoSong(
            videoId,
            regionCode,
            user.token
          );
          setVideoSong(songVideo);
          setVideoId("");
          setRegionCode("");
          console.log("songVideo", songVideo);
        }
      }
      fetchSong();
    },

    [videoId, regionCode, videoSong, user.token]
  );

  return (
    <div className="homeContainer">
      <span
        className={styles.addBtn}
        onClick={() => setOptions((prev) => !prev, console.log("user", user))}
      >
        ➕
        {options && (
          <div className={styles.playlistOptions}>
            <select
              className={styles.playlistSelect}
              onClick={(e) => {
                e.stopPropagation();
              }}
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            >
              <option value="">Select Playlist</option>
              {user.playlists.length > 0 ? (
                user.playlists.map((playlist, index) => (
                  <option key={index} value={playlist.name}>
                    {playlist.name}
                  </option>
                ))
              ) : (
                <option value="">No Playlists</option>
              )}
            </select>
            <input
              className={styles.playlistInput}
              type="text"
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={() => handleAddSongToPlaylist(playlistName)}
              type="addBtn"
            >
              Add Song to Playlist
            </Button>
          </div>
        )}
      </span>
      <span className={styles.songDetails}>
        {artist} - {songName}
      </span>

      <div className={styles.song}>
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
      </div>
    </div>
  );
}

export default Song;
