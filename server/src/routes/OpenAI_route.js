const express = require("express");
const OpenAI_service = require("../services/OpenAI_service");
const openaiRouter = express.Router();

openaiRouter.post("/openai", async (req, res) => {
  try {
    const suggestions = await OpenAI_service.SongSuggestions(req.body);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = openaiRouter;
