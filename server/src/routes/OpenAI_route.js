const express = require("express");
const OpenAI_service = require("../services/OpenAI_service");
const openaiRouter = express.Router();

openaiRouter.post("/openai", OpenAI_service.SongSuggestions);

module.exports = openaiRouter;
