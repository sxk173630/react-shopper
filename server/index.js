const express = require("express");
const path = require("path");
const getRoutes = require("./routes");
const PORT = process.env.PORT || 3001;

const app = express();
//This middleware, or function that runs before each of the endpoints/each of our controllers, allows us to pass the request body that comes in as JSON data.
app.use(express.json());

//Serve the built version of our React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use("/api", getRoutes());

//All routes that don't match api will be caught by this route (routed through our React app)
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});