const asyncHandler = require("../utils/asyncHandler");
const applicationService = require("../services/application.service");

const applyForJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyForJob(
    req.params.jobId,
    req.user._id,
    req.body.answers,
  );

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    data: application,
  });
});

const getMyApplications = asyncHandler(async (req, res) => {
  // console.log(req.user._id);
  const applications = await applicationService.getMyApplications(req.user._id);

  res.status(200).json({
    success: true,
    data: applications,
  });
});

const applyToAll = asyncHandler(async (req, res) => {
  const result = await applicationService.applyToAll(
    req.body.jobIds,
    req.user._id,
    req.body.answersByJob,
  );

  res.status(201).json({
    success: true,
    message: "Bulk application process completed",
    data: result,
  });
});

const getRecruiterApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getRecruiterApplications(
    req.user._id,
  );

  res.status(200).json({
    success: true,
    data: applications,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.user._id,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: "Application status updated successfully",
    data: application,
  });
});

const getApplicationsByJob = asyncHandler(async (req, res) => {
  const applications = await applicationService.getApplicationsByJob(
    req.params.jobId,
    req.user._id,
  );

  res.status(200).json({
    success: true,
    data: applications,
  });
});

const getAdminApplicationsByJob = asyncHandler(async (req, res) => {
  const data = await applicationService.getAdminApplicationsByJob(
    req.params.jobId,
  );

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = {
  applyForJob,
  getMyApplications,
  applyToAll,
  getRecruiterApplications,
  updateApplicationStatus,
  getApplicationsByJob,
  getAdminApplicationsByJob,
};
