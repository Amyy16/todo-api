const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const taskRoute = require("./routes/task");
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to database"))
  .catch((error) => console.log(error.message));

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use("/user", authRoute);
app.use("/user", userRoute);
app.use(taskRoute);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
