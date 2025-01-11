const express = require("express");
const homeRoute = require("./routes/homePage_route.js");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;

function initApp() {
  console.log("Initializing app");
  const app = express();
  const { urlencoded, json } = express;

  app.use(urlencoded({ extended: true }));

  app.use(json());

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.use("/moodiify", homeRoute);
}

initApp();

module.exports = initApp;
