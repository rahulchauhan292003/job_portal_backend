const express = require("express");
const cors = require("cors");

const jobRoutes = require("./routes/job.routes");
const authRoutes = require("./routes/auth.routes");
const applicationRoutes = require("./routes/application.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Application Portal API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use(errorMiddleware);

module.exports = app;
