const Job = require("../models/Job");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const jobService = require("../services/job.service");
const {
  updateRecruiterJobStatus,
  getAdminJobs,
  updateAdminJobStatus,
} = require("../services/job.service");

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
  const jobs = await jobService.getRecruiterJobs(req.user._id);

  res.status(200).json({
    success: true,
    data: jobs,
  });
});

const updateRecruiterJobStatusController = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;

  const job = await updateRecruiterJobStatus(jobId, req.user._id, status);

  let message = "Job status updated successfully";

  if (status === "closed") {
    message = "Job closed successfully";
  }

  if (status === "active") {
    message = "Job reopened successfully";
  }

  if (status === "deleted") {
    message = "Job deleted successfully";
  }

  res.status(200).json({
    success: true,
    message,
    job,
  });
});

const getAdminJobsController = asyncHandler(async (req, res) => {
  const { search = "", status = "", page = 1, limit = 10 } = req.query;

  const result = await getAdminJobs({
    search,
    status,
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

const updateAdminJobStatusController = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;

  const job = await updateAdminJobStatus(jobId, status);

  res.status(200).json({
    success: true,
    message: "Job status updated successfully",
    job,
  });
});

const updateRecruiterJobController = asyncHandler(async (req, res) => {
  const job = await jobService.updateRecruiterJob(
    req.params.jobId,
    req.user._id,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    data: job,
  });
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs,
  updateRecruiterJobStatusController,
  getAdminJobsController,
  updateAdminJobStatusController,
  updateRecruiterJobController
};
