// Description: This file is the entry point of the application.

const express = require("express");
const mongoose = require("mongoose");
const categoriesRouter = require("./src/routes/Categories_route");
const recommendRouter = require("./src/routes/Recommends_routes");
const songRouter = require("./src/routes/Song_routes");
const openaiRouter = require("./src/routes/OpenAI_route");
const authRouter = require("./src/routes/Auth_routes");
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const initApp = async () => {
  console.log("Initializing app");
  try {
    mongoose
      .connect(process.env.DB_CONNECTION)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.log("MongoDB connection error: ", err));
    const app = express();
    app.use(cors()); // Enable CORS for all routes
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use("/auth", authRouter);
    app.use("/moodiify/recommends", recommendRouter);
    app.use("/moodiify/categories", categoriesRouter);
    app.use("/moodiify/videoSong", songRouter);
    app.use("/api", openaiRouter);

    return app;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = initApp;
