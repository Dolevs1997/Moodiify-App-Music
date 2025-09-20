const { fetchPlaylists } = require("../services/YouTube_service");

const getAll = async (req, res) => {
  const token = req.token;
  const query = req.query;
  console.log("Query Params: ", query);
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories?limit=${req.query.limit}&locale=${req.query.locale}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await result.json();
  res.status(200).json(data);
};

const getById = async (req, res) => {
  const name = req.query.name;
  const country = req.query.country || "US";
  const locationName = req.query.location || "United States";
  if (!name) {
    return res
      .status(400)
      .json({ error: "Please provide name in query params" });
  }
  const result = await fetchPlaylists(name, country, locationName);
  if (!result) {
    return res.status(400).json({ error: "No playlists found" });
  }
  res.status(200).json(result);
};

module.exports = { getAll, getById };
