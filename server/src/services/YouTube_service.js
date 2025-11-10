const dotenv = require("dotenv");
dotenv.config();
const API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchPlaylists(
  playlistName,
  country = "US",
  location = "United States"
) {
  const controller = new AbortController();
  const signal = controller.signal;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=23&q=${playlistName} ${location} music playlists&regionCode=${country}&type=playlist&key=${API_KEY}`;
  try {
    const response = await fetch(url, { signal });
    const data = await response.json();
    // console.log("Playlists data:", data);
    return data.items.map((item) => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw new Error("Failed to fetch playlists");
  }
  // if (!response.ok) {
  //   throw new Error(`Error fetching playlists: ${response.statusText}`);
  // }
}

async function fetchPlaylistSongs(playlistId) {
  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }
  const controller = new AbortController();
  const signal = controller.signal;

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;
  const response = await fetch(url, { signal });
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
