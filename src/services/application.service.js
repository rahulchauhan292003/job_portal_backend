const Application = require("../models/Application");
const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");

const validateAnswers = (questions, answers) => {
  const questionMap = new Map(
    questions.map((question) => [question.questionId, question]),
  );

  const answerMap = new Map(
    answers.map((item) => [item.questionId, item.answer]),
  );

  // Check for unknown questions
  for (const answer of answers) {
    if (!questionMap.has(answer.questionId)) {
      throw new ApiError(400, `Invalid question: ${answer.questionId}`);
    }
  }

  // Validate each job question
  for (const question of questions) {
    const answer = answerMap.get(question.questionId);

    if (
      question.required &&
      (answer === undefined ||
        answer === null ||
        answer === "" ||
        (Array.isArray(answer) && answer.length === 0))
    ) {
      throw new ApiError(400, `${question.label} is required`);
    }

    if (
      answer === undefined ||
      answer === null ||
      answer === "" ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      continue;
    }

    switch (question.type) {
      case "text":
      case "textarea":
        if (typeof answer !== "string") {
          throw new ApiError(400, `${question.label} must be text`);
        }
        break;

      case "number":
        if (typeof answer !== "number" || Number.isNaN(answer)) {
          throw new ApiError(400, `${question.label} must be a number`);
        }
        break;

      case "boolean":
        if (typeof answer !== "boolean") {
          throw new ApiError(400, `${question.label} must be true or false`);
        }
        break;

      case "dropdown":
        if (!question.options.includes(answer)) {
          throw new ApiError(400, `Invalid option for ${question.label}`);
        }
        break;

      case "checkbox":
        if (!Array.isArray(answer)) {
          throw new ApiError(
            400,
            `${question.label} must contain multiple options`,
          );
        }

        const hasInvalidOption = answer.some(
          (option) => !question.options.includes(option),
        );

        if (hasInvalidOption) {
          throw new ApiError(400, `Invalid option for ${question.label}`);
        }
        break;

      default:
        throw new ApiError(400, "Unsupported question type");
    }
  }
};

const applyForJob = async (jobId, applicantId, answers) => {
  const job = await Job.findOne({ jobId });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const existingApplication = await Application.findOne({
    applicant: applicantId,
    job: job._id,
  });

  if (existingApplication) {
    throw new ApiError(409, "You have already applied for this job");
  }

  validateAnswers(job.questions, answers);

  const application = await Application.create({
    applicant: applicantId,
    job: job._id,
    answers,
  });

  return application;
};

const getMyApplications = async (applicantId) => {
  const applications = await Application.find({
    applicant: applicantId,
  })
    .populate("job", "jobId title company location")
    .sort({ createdAt: -1 });

  return applications;
};

const applyToAll = async (jobIds, applicantId, answersByJob) => {
  const results = {
    submitted: [],
    failed: [],
  };

  for (const jobId of jobIds) {
    try {
      const job = await Job.findOne({ jobId });

      if (!job) {
        throw new ApiError(404, "Job not found");
      }

      const existingApplication = await Application.findOne({
        applicant: applicantId,
        job: job._id,
      });

      if (existingApplication) {
        throw new ApiError(409, "You have already applied for this job");
      }

      const answers = answersByJob[jobId] || [];

      validateAnswers(job.questions, answers);

      await Application.create({
        applicant: applicantId,
        job: job._id,
        answers,
      });

      results.submitted.push(jobId);
    } catch (error) {
      results.failed.push({
        jobId,
        reason: error.message,
      });
    }
  }

  return results;
};

const getRecruiterApplications = async (recruiterId) => {
  // console.log("ID------", recruiterId);

  const jobs = await Job.find({
    createdBy: recruiterId,
  }).select("_id jobId title company createdBy");

  // console.log("jobs------>", jobs);

  const jobIds = jobs.map((job) => job._id);

  const applications = await Application.find({
    job: { $in: jobIds },
  })
    .populate("applicant", "name email")
    .populate("job", "jobId title company")
    .sort({ createdAt: -1 });

  return applications;
};

const updateApplicationStatus = async (applicationId, recruiterId, status) => {
  const application = await Application.findById(applicationId).populate(
    "job",
    "jobId title company createdBy",
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Recruiter can update only applications
  // belonging to their own jobs
  if (application.job.createdBy?.toString() !== recruiterId.toString()) {
    throw new ApiError(
      403,
      "You do not have permission to update this application",
    );
  }

  application.status = status;

  await application.save();

  return application;
};

const getApplicationsByJob = async (jobId, recruiterId) => {
  const job = await Job.findOne({
    jobId,
    createdBy: recruiterId,
  });

  if (!job) {
    throw new ApiError(404, "Job not found or you do not have permission");
  }

  const applications = await Application.find({
    job: job._id,
  })
    .populate("applicant", "name email")
    .populate("job", "jobId title company questions")
    .sort({ createdAt: -1 });

  return applications;
};

const getAdminApplicationsByJob = async (jobId) => {
  const job = await Job.findById(jobId).populate(
    "createdBy",
    "name email role",
  );

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (!job.createdBy) {
    throw new ApiError(404, "Recruiter information not found");
  }

  if (job.createdBy.role !== "recruiter") {
    throw new ApiError(404, "This job does not belong to a recruiter");
  }

  const applications = await Application.find({
    job: job._id,
  })
    .populate("applicant", "name email")
    .sort({ createdAt: -1 });

  return {
    job,
    applications,
  };
};

module.exports = {
  validateAnswers,
  applyForJob,
  getMyApplications,
  applyToAll,
  getRecruiterApplications,
  updateApplicationStatus,
  getApplicationsByJob,
  getAdminApplicationsByJob,
};
