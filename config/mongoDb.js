const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME,
    family: 4,
  })
  .then(() => {
    console.log("Mongodb Connect");
  })
  .catch((error) => console.log(error));

mongoose.connection.on("connected", () => {
  console.log("mongoose Connected to db");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection is Disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
