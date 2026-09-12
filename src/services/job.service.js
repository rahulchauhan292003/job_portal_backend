const Job = require("../models/Job");

const getJobs = async ({
  search = "",
  location = "",
  page = 1,
  limit = 10,
}) => {
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 50);

  const query = {};

  if (search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { company: { $regex: search.trim(), $options: "i" } },
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

  return {
    jobs,
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
  });

  return job;
};

const getRecruiterJobs = async (recruiterId) => {
  const jobs = await Job.aggregate([
    {
      $match: {
        createdBy: recruiterId,
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

module.exports = {
  getJobs,
  getJobById,
  createJob,
   getRecruiterJobs,
};
