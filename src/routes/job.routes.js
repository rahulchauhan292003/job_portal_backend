const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs,
  updateRecruiterJobStatusController,
  getAdminJobsController,
  updateAdminJobStatusController,
  updateRecruiterJobController,
} = require("../controllers/job.controller");

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
  createJobSchema,
  updateJobStatusSchema,
} = require("../validators/job.validator");

const router = express.Router();

// Recruiter jobs
router.get(
  "/recruiter",
  authMiddleware,
  allowRoles("recruiter", "admin"),
  getRecruiterJobs,
);

// Admin - all jobs
router.get(
  "/admin",
  authMiddleware,
  allowRoles("admin"),
  getAdminJobsController,
);

// Admin - update any job status
router.patch(
  "/admin/:jobId/status",
  authMiddleware,
  allowRoles("admin"),
  validate(updateJobStatusSchema),
  updateAdminJobStatusController,
);

// Public - active jobs only
router.get("/", authMiddleware, getJobs);

// Get single job
router.get("/:id", getJobById);

router.patch(
  "/:jobId",
  authMiddleware,
  allowRoles("admin", "recruiter"),
  validate(createJobSchema),
  updateRecruiterJobController,
);

// Create job
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "recruiter"),
  validate(createJobSchema),
  createJob,
);

// Recruiter - update own job status
router.patch(
  "/:jobId/status",
  authMiddleware,
  allowRoles("recruiter"),
  validate(updateJobStatusSchema),
  updateRecruiterJobStatusController,
);

module.exports = router;
