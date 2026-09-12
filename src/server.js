require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedJobs = require("./seed/jobs.seed");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  await seedJobs();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
