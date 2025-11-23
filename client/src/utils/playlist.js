import axios from "axios";
async function addSongToPlaylist(songName, artist, state, playlistName, user) {
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
  return response.data;
}
export { addSongToPlaylist };
