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
  playlistId: null,
  inPlaylist: false,
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
    case "SET_IN_PLAYLIST":
      return {
        ...state,
        inPlaylist: action.payload.inPlaylist,
        playlistId: action.payload.playlistId,
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
  playlistId,
}) {
  const navigate = useNavigate();
  const songName = song.split(" - ")[1];
  const artist = song.split(" - ")[0];
  const [playlistName, setPlaylistName] = useState("");
  const [options, setOptions] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialSong);
  const playerRef = useRef(null);
  const [setIsSongPlaying] = useState(false);

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
  useEffect(() => {
    if (!state.videoId || !user || !user.token) return;

    async function findSongInPlaylists() {
      console.log("Checking if song is in user's playlists...");
      // 1) quick local check if user.playlists contains song lists
      if (Array.isArray(user.playlists) && user.playlists.length > 0) {
        for (const pl of user.playlists) {
          // support both shapes: pl.songs array or pl.items array
          const songsList = pl.songs || pl.items || pl.tracks;
          if (Array.isArray(songsList)) {
            const found = songsList.find(
              (s) =>
                s.videoId === state.videoId ||
                s.videoId === state.videoId?.toString()
            );
            if (found) {
              dispatch({
                type: "SET_IN_PLAYLIST",
                payload: {
                  inPlaylist: true,
                  playlistId: pl.id || pl._id || pl.playlistId,
                },
              });
              return;
            }
          }
        }
      }
    }
    findSongInPlaylists();
  }, [state.videoId, user]);
  async function handleAddSongToPlaylist(playlistName) {
    try {
      const response = await axios.post(
        `http://${import.meta.env.VITE_SERVER_URL}/moodiify/playlist/create`,
        {
          songName: songName,
          artist: artist,
          videoId: state.videoId,
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

      if (!Array.isArray(user.playlists)) {
        user.playlists = [];
      }
      dispatch({
        type: "SET_IN_PLAYLIST",
        payload: {
          inPlaylist: true,
          playlistId: response.data.playlist._id,
        },
      });
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
              playlistId: playlistId,
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
    [
      artist,
      songName,
      user.token,
      state.videoId,
      state.regionCode,
      country,
      playlistId,
    ]
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
        {state.inPlaylist ? "Remove from Playlist" : "Add to Playlist"}
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
            {state.inPlaylist && <Button>Remove from Playlist</Button>}
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
              console.log("Playing videoId:", state.videoId);
              console.log("playingVideoId state:", playingVideoId);
              console.log("playerRef", playerRef);
            }}
            onPause={() => {
              setIsSongPlaying(false);
              if (playingVideoId === state.videoId) {
                setPlayingVideoId(null);
              }
            }}
          />
        ) : (
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
  playlistId: propTypes.string,
};

export default Song;
