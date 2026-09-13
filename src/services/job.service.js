const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");
const Application = require("../models/Application");

const getJobs = async ({
  search = "",
  location = "",
  page = 1,
  limit = 10,
  userId,
}) => {
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 50);

  const query = {
    status: "active",
  };

  if (search.trim()) {
    query.$or = [
      {
        title: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        company: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (location.trim()) {
    query.location = {
      $regex: location.trim(),
      $options: "i",
    };
  }

  const skip = (pageNumber - 1) * limitNumber;

  const [jobs, totalJobs] = await Promise.all([
    Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),

    Job.countDocuments(query),
  ]);

  let appliedJobIds = new Set();

  if (userId) {
    const applications = await Application.find({
      applicant: userId,
    }).select("job");

    appliedJobIds = new Set(
      applications.map((application) => application.job.toString()),
    );
  }

  //  applied status
  const jobsWithAppliedStatus = jobs.map((job) => ({
    ...job.toObject(),

    applied: appliedJobIds.has(job._id.toString()),
  }));

  return {
    jobs: jobsWithAppliedStatus,

    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limitNumber),
    },
  };
};

const getJobById = async (jobId) => {
  return Job.findOne({ jobId });
};

const createJob = async (jobData, userId) => {
  const job = await Job.create({
    ...jobData,
    jobId: `job-${Date.now()}`,
    createdBy: userId,
    status: "active",
  });

  return job;
};

const getRecruiterJobs = async (recruiterId) => {
  const jobs = await Job.aggregate([
    {
      $match: {
        createdBy: recruiterId,
        status: {
          $in: ["active", "closed"],
        },
      },
    },
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "job",
        as: "applications",
      },
    },
    {
      $project: {
        _id: 1,
        jobId: 1,
        title: 1,
        company: 1,
        location: 1,
        description: 1,
        status: 1,
        createdAt: 1,
        applicantCount: {
          $size: "$applications",
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return jobs;
};

const updateRecruiterJobStatus = async (jobId, recruiterId, status) => {
  if (!["active", "closed", "deleted"].includes(status)) {
    throw new ApiError(400, "Invalid job status");
  }

  const job = await Job.findOne({
    jobId,
    createdBy: recruiterId,
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.status === "deleted") {
    throw new ApiError(400, "Deleted job cannot be reopened");
  }

  job.status = status;

  await job.save();

  return job;
};

const getAdminJobs = async ({
  search = "",
  status = "",
  page = 1,
  limit = 10,
}) => {
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 50);

  const filter = {};

  if (search.trim()) {
    filter.$or = [
      {
        title: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        company: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        location: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (status) {
    if (!["active", "closed", "deleted"].includes(status)) {
      throw new ApiError(400, "Invalid job status");
    }

    filter.status = status;
  }

  const skip = (pageNumber - 1) * limitNumber;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),

    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const updateAdminJobStatus = async (jobId, status) => {
  if (!["active", "closed", "deleted"].includes(status)) {
    throw new ApiError(400, "Invalid job status");
  }

  const job = await Job.findOne({ jobId });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  job.status = status;

  await job.save();

  return job;
};

const updateRecruiterJob = async (jobId, recruiterId, jobData) => {
  const job = await Job.findOne({
    jobId,
    createdBy: recruiterId,
    status: { $in: ["active", "closed"] },
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  job.title = jobData.title;
  job.company = jobData.company;
  job.location = jobData.location;
  job.description = jobData.description;

  job.questions = jobData.questions || [];

  await job.save();

  return job;
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs,
  updateRecruiterJobStatus,
  getAdminJobs,
  updateAdminJobStatus,
  updateRecruiterJob,
};
