const Job = require("../models/Job");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const jobService = require("../services/job.service");

// Get all jobs
const getJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getJobs(req.query);

  res.status(200).json({
    success: true,
    data: result.jobs,
    pagination: result.pagination,
  });
});

// Get single job
const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

// Create job
const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: "Job created successfully",
    data: job,
  });
});


const getRecruiterJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getRecruiterJobs(
    req.user._id
  );

  res.status(200).json({
    success: true,
    data: jobs,
  });
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs
};
