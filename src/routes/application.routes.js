const express = require("express");

const {
  applyForJob,
  getMyApplications,
  applyToAll,
  getRecruiterApplications,
  updateApplicationStatus,
  getApplicationsByJob,
  getAdminApplicationsByJob,
} = require("../controllers/application.controller");

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
  applySchema,
  bulkApplySchema,
  updateStatusSchema,
} = require("../validators/application.validator");

const router = express.Router();

router.get("/", authMiddleware, allowRoles("user"), getMyApplications);

router.post(
  "/:jobId/apply",
  authMiddleware,
  allowRoles("user"),
  validate(applySchema),
  applyForJob,
);

router.post(
  "/bulk",
  authMiddleware,
  allowRoles("user"),
  validate(bulkApplySchema),
  applyToAll,
);

router.get(
  "/recruiter",
  authMiddleware,
  allowRoles("recruiter", "admin"),
  getRecruiterApplications,
);

router.get(
  "/recruiter/job/:jobId",
  authMiddleware,
  allowRoles("recruiter", "admin"),
  getApplicationsByJob,
);

router.get(
  "/admin/job/:jobId",
  authMiddleware,
  allowRoles("admin"),
  getAdminApplicationsByJob,
);

router.patch(
  "/:id/status",
  authMiddleware,
  allowRoles("recruiter", "admin"),
  validate(updateStatusSchema),
  updateApplicationStatus,
);

module.exports = router;
