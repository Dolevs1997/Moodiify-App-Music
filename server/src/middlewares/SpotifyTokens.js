const dotenv = require("dotenv");

dotenv.config();

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const getTokens = async () => {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  return data.access_token;
};

const validateToken = async (req, res, next) => {
  try {
    const token = await getTokens();
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { validateToken };
