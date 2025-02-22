// Description: This file is the entry point of the application.

const express = require("express");
const homeRouter = require("./src/routes/homePage_route");
const openaiRouter = require("./src/routes/OpenAI_route");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");

const initApp = async () => {
  console.log("Initializing app");
  const app = express();
  app.use(cors()); // Enable CORS for all routes

  app.use(json());

  app.use(urlencoded({ extended: true }));

  app.use("/moodiify", homeRouter);
  app.use("/api", openaiRouter);

  return app;
};

module.exports = initApp;
