const getAll = async (req, res) => {
  const token = req.token;
  const result = await fetch(
    `https://api.spotify.com/v1/browse/categories?limit=${req.query.limit}`,
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

module.exports = { getAll };
