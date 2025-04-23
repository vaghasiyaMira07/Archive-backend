// Third party Modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
var cors = require("cors");
const CronJob = require("cron").CronJob;

const Cron = require("./utils/backup");
// Required Routes
const userRoute = require("./routes/user");
const projectRoute = require("./routes/project");
const reportRoute = require("./routes/report");
const notificationRoute = require("./routes/notification");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Root Route
app.use("/api/v1/user", userRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/report", reportRoute);
app.use("/api/v1/notification", notificationRoute);

// Connect to MongoDb
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    const port = process.env.SERVER_PORT || 8000;
    app.listen(port);
    console.log(`Server serve with port number: ${port}`);
    console.log("mongoDB connected.....");
  })
  .catch((err) => console.log(err));

// Cron Job for auto db backup for daily
let Job = new CronJob(
  "0 1 * * *",
  function () {
    console.log("Cron Job is running", Date.now());
    Cron.dbAutoBackUp();
  },
  null,
  true
);
Job.start();
