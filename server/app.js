// Description: This file is the entry point of the application.

const express = require("express");
const categoriesRouter = require("./src/routes/Categories_route");
const recommendRouter = require("./src/routes/Recommends_routes");
const songRouter = require("./src/routes/Song_routes");
const openaiRouter = require("./src/routes/OpenAI_route");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");

const initApp = async () => {
  console.log("Initializing app");
  const app = express();
  app.use(cors()); // Enable CORS for all routes

  app.use(json());

  app.use(urlencoded({ extended: true }));

  app.use("/moodiify/recommends", recommendRouter);
  app.use("/moodiify/categories", categoriesRouter);
  app.use("/moodiify/videoSong", songRouter);
  app.use("/api", openaiRouter);

  return app;
};

module.exports = initApp;
