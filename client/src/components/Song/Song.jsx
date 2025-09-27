/* eslint-disable react/prop-types */
import styles from "./Song.module.css";
import { useState, useEffect, useReducer } from "react";
import axios from "axios";
// import { fetchVideoSong } from "../../services/YouTube_service";
import { useNavigate } from "react-router";
import Button from "../Button/Button";
const initialSong = {
  videoId: "",
  title: "",
  artist: "",
  regionCode: "",
  loading: true,
  error: null,
};
function reducer(state, action) {
  console.log("Reducer action:", action);
  switch (action.type) {
    case "LOADING_SONG":
      return {
        ...state,
        loading: true,
      };

    case "SET_VIDEO_SONG":
      return {
        ...state,
        videoId: action.payload.videoId,
        title: action.payload.title,
        artist: action.payload.artist,
        regionCode: action.payload.regionCode,
        loading: false,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
}

function Song({ song, user, country = "US" }) {
  const navigate = useNavigate();
  console.log("song in Song component:", song);
  const songName = song.split(" - ")[1];
  const artist = song.split(" - ")[0];
  const [playlistName, setPlaylistName] = useState("");
  const [options, setOptions] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialSong);

  // console.log("state", state);
  if (!user.token) {
    navigate("/login");
  }
  if (!user.playlists) {
    user.playlists = [];
    localStorage.setItem("user", JSON.stringify(user));
    console.log("No playlists found, initializing user.playlists");
  }
  if (user.playlists.length === 0) {
    user.playlists = [];
  }
  async function handleAddSongToPlaylist(playlistName) {
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

      // Check if the playlist already exists
      const existingPlaylist = user.playlists.find(
        (playlist) => playlist.name === response.data.playlist.name
      );
      if (existingPlaylist) {
        // If it exists, update the playlist ID
        user.playlists = user.playlists.map((playlist) =>
          playlist.name === response.data.playlist.name
            ? { ...playlist, id: response.data.playlist._id }
            : playlist
        );
      } else {
        user.playlists.push({
          id: response.data.playlist._id,
          name: response.data.playlist.name,
        });
      }

      console.log("user playlists", user.playlists);

      localStorage.setItem("user", JSON.stringify(user));
      setOptions(false);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
    setPlaylistName("");
  }

  useEffect(
    function () {
      async function fetchSongRecommendations(artist, songName) {
        if (!artist || !songName || !user.token) return;
        console.log(
          "Fetching song recommendations for:",
          artist,
          songName,
          country
        );
        try {
          const response = await axios.get(
            `http://${
              import.meta.env.VITE_SERVER_URL
            }/moodiify/recommends/?artist=${artist}&songName=${songName}&country=${country}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          const data = response.data;
          console.log("data", data);

          dispatch({
            type: "SET_VIDEO_SONG",
            payload: {
              videoId: data.videoId,
              regionCode: data.regionCode,
              title: data.title,
              artist: data.artist,
            },
          });
        } catch (error) {
          console.error("Error fetching song recommendations:", error);
          dispatch({
            type: "SET_ERROR",
            payload: { error: "Failed to fetch song recommendations" },
          });
        }
      }
      fetchSongRecommendations(artist, songName);
    },
    [artist, songName, user.token, state.videoId, state.regionCode, country]
  );

  return (
    <div className="homeContainer">
      <span
        className={styles.addBtn}
        onClick={() =>
          setOptions(
            (prev) => !prev,
            console.log("user playlist", user.playlists)
          )
        }
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

      <>
        {!state.loading && state.videoId ? (
          <iframe
            width="400"
            height="300"
            src={`https://www.youtube.com/embed/${state.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={state.title}
          ></iframe>
        ) : (
          <div className={styles.noVideo}>No Video Available</div>
        )}
        {state.loading && <div className={styles.loading}>Loading...</div>}
        {state.error && <div className={styles.error}>{state.error}</div>}
      </>
    </div>
  );
}
export default Song;
