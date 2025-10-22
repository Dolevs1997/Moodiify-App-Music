import styles from "./Song.module.css";
import { useState, useEffect, useReducer, useRef } from "react";
import axios from "axios";
// import { fetchVideoSong } from "../../services/YouTube_service";
import { useNavigate } from "react-router";
import Button from "../Button/Button";
import YouTube from "react-youtube";
import propTypes from "prop-types";
const opts = {
  height: "300",
  width: "400",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
  },
};
const initialSong = {
  videoId: "",
  title: "",
  artist: "",
  regionCode: "",
  loading: true,
  error: null,
};
function reducer(state, action) {
  // console.log("Reducer action:", action);
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

function Song({
  song,
  user,
  country = "US",
  playingVideoId,
  setPlayingVideoId,
}) {
  const navigate = useNavigate();
  // console.log("song in Song component:", song);
  const songName = song.split(" - ")[1];
  const artist = song.split(" - ")[0];
  const [playlistName, setPlaylistName] = useState("");
  const [options, setOptions] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialSong);
  const playerRef = useRef(null);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
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
        // console.log(
        //   "Fetching song recommendations for:",
        //   artist,
        //   songName,
        //   country
        // );
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
          // console.log("data", data);

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

  useEffect(() => {
    if (
      playerRef.current &&
      playingVideoId &&
      playingVideoId !== state.videoId
    ) {
      try {
        playerRef.current.pauseVideo();
        setIsSongPlaying(false);
      } catch (error) {
        // ignore if player not ready
        console.error("Error pausing video:", error);
      }
    }
  }, [playingVideoId, state.videoId, setIsSongPlaying]);
  function onPlayerReady(event) {
    playerRef.current = event.target;
  }

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
          <YouTube
            videoId={state.videoId}
            title={state.title}
            opts={opts}
            onReady={onPlayerReady}
            onPlay={() => {
              setPlayingVideoId(state.videoId);
              setIsSongPlaying(true);
            }}
            onPause={() => {
              setIsSongPlaying(false);
              if (playingVideoId === state.videoId) {
                setPlayingVideoId(null);
              }
            }}
          />
        ) : (
          // <iframe
          //   width="400"
          //   height="300"
          //   src={`https://www.youtube.com/embed/${state.videoId}`}
          //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          //   allowFullScreen
          //   title={state.title}
          // ></iframe>
          <div className={styles.noVideo}>No Video Available</div>
        )}
        {state.loading && <div className={styles.loading}>Loading...</div>}
        {state.error && <div className={styles.error}>{state.error}</div>}
      </>
    </div>
  );
}

Song.propTypes = {
  song: propTypes.string.isRequired,
  user: propTypes.shape({
    _id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    token: propTypes.string.isRequired,
    playlists: propTypes.arrayOf(
      propTypes.shape({
        name: propTypes.string,
      })
    ),
  }).isRequired,
  country: propTypes.string,
  playingVideoId: propTypes.string,
  setPlayingVideoId: propTypes.func,
};

export default Song;
