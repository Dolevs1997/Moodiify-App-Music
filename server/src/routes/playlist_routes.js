const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist_controller");
const { authenticate } = require("../middlewares/auth_middleware");
const { validateToken } = require("../middlewares/SpotifyTokens");

router.post(
  "/create",
  authenticate,
  validateToken,
  playlistController.createPlaylist
);
router.get(
  "/",
  authenticate,
  validateToken,
  playlistController.getPlaylistSongs
);

module.exports = router;
