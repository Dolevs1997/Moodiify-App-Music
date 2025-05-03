const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchPlaylists(playlistName) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=23&q=${playlistName} music playlists&regionCode=IL&type=playlist&key=${API_KEY}`;
  console.log("Fetching playlists from URL:", url);
  const response = await fetch(url);
  // if (!response.ok) {
  //   throw new Error(`Error fetching playlists: ${response.statusText}`);
  // }
  const data = await response.json();
  if (!data || !data.items) {
    throw new Error("No playlists found");
  }
  if (data.items.length === 0) {
    throw new Error("No playlists found");
  }
  return data.items.map((item) => ({
    id: item.id.playlistId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.default.url,
    publishedAt: item.snippet.publishedAt,
  }));
}

async function fetchPlaylistSongs(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching playlist songs: ${response.statusText}`);
  }
  const data = await response.json();
  // console.log("Playlist songs data:", data);
  if (!data || !data.items) {
    throw new Error("No playlist songs found");
  }
  return data.items
    .filter((item) => item.snippet.resourceId.kind === "youtube#video")
    .map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
    }));
}

module.exports = {
  fetchPlaylists,
  fetchPlaylistSongs,
};
