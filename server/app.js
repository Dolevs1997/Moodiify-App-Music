const express = require("express");
const router = require("./router");
const app = express();

function initApp() {
  app.use(express.json());
  app.use(router);
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}
