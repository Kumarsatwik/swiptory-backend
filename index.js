const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
require("dotenv").config();

require("./config/mongoDb");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const bookmarkRoutes = require("./routes/saveRoutes");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/bookmark", bookmarkRoutes);



app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
