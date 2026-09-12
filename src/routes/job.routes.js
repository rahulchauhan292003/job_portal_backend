const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  getRecruiterJobs,
} = require("../controllers/job.controller");

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const { createJobSchema } = require("../validators/job.validator");

const router = express.Router();

router.get(
  "/recruiter",
  authMiddleware,
  allowRoles("recruiter", "admin"),
  getRecruiterJobs,
);

router.get("/", getJobs);

router.get("/:id", getJobById);

router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "recruiter"),
  validate(createJobSchema),
  createJob,
);

module.exports = router;
