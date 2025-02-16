const getAll = async (req, res) => {
  console.log("query: ", req.query);
  console.log("Getting all genres");
  console.log("token: ", req.token);
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
  console.log("Fetching all genres");
  const data = await result.json();
  console.log("data: ", data);
  res.status(200).json(data);
};

module.exports = { getAll };
