const { createServer } = require("http");
const initApp = require("./app");
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();

initApp().then((app) => {
  console.log("server.js: Initializing app");
  if (process.env.NODE_ENV !== "production") {
    console.log("Server is running in development mode");
    const server = createServer(app);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  if (process.env.NODE_ENV === "production") {
    console.log("Server is running in production mode");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});
