const Redis = require("ioredis");
const { createClient } = require("redis");
const redis = new Redis(process.env.REDIS_URL);
function cacheKey(song, country) {
  // console.log(
  //   `recommends:${encodeURIComponent(artist)}|${encodeURIComponent(
  //     song
  //   )}|${country}`
  // );

  return `recommends:${encodeURIComponent(song)}|${country}`;
}

async function getCachedSong(song, country) {
  const key = cacheKey(song, country);
  const cachedData = await redis.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
}
async function setCachedSong(song, country, data) {
  console.log("Setting cache for song:", data);
  const key = cacheKey(song, country);
  await redis.set(key, JSON.stringify(data), "EX", 3600); // Cache for 1 hour
}

async function connectRedis() {
  const client = createClient();
  await client.connect();

  console.log("Connected to Redis");
}
module.exports = {
  getCachedSong,
  setCachedSong,
  connectRedis,
};
