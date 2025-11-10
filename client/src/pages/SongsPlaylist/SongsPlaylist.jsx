// import styles from "./SongsPlaylist.module.css";
import { useParams, useLocation } from "react-router";
import { useEffect, useState, useContext } from "react";
import Song from "../../components/Song/Song";
import Logo from "../../components/Logo/Logo";
import Search from "../../components/Search/Search";
import NavBar from "../../components/NavBar/NavBar";
import { SearchContext } from "../../Contexts/SearchContext";
// import { useNavigate } from "react-router-dom";
function SongsPlaylist() {
  const { playlistId } = useParams();
  const location = useLocation();
  const { playlistName } = location.state || {};
  const [playlist, setPlaylist] = useState([]);
  const searchContext = useContext(SearchContext);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  // console.log("playlist", playlist);
  // console.log("SearchContext in SongsPlaylist:", searchContext);
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(
          `http://${
            import.meta.env.VITE_SERVER_URL
          }/moodiify/videoSong/playlist/?id=${playlistId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPlaylist(data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchPlaylist();
  }, [playlistId, user]);
  return (
    <main className="homeContainer">
      <div className="header">
        <Logo />
        <Search
          setFormVisible={searchContext.setFormVisible}
          formVisible={searchContext.formVisible}
          isMapVisible={searchContext.isMapVisible}
          setIsMapVisible={searchContext.setIsMapVisible}
          isRecording={searchContext.isRecording}
          setIsRecording={searchContext.setIsRecording}
          userData={user}
          setSongSuggestions={searchContext.setSongSuggestions}
          setIsVoiceSearch={searchContext.setIsVoiceSearch}
          isVoiceSearch={searchContext.isVoiceSearch}
        />
        <NavBar user={user} />
      </div>
      <h2>{playlistName}</h2>
      <div className="playlist-songs">
        {playlist.length > 0 ? (
          <ul className="songsContainer">
            {playlist
              .filter((song) => song.title.includes("-"))
              .map((song, index) => (
                <Song
                  song={song.title}
                  user={user}
                  key={index}
                  country={location.state.country}
                />
              ))}
          </ul>
        ) : (
          <p>No songs found in this playlist.</p>
        )}
      </div>
    </main>
  );
}

export default SongsPlaylist;
