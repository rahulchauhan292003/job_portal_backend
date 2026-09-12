const express = require("express");

const {
  signup,
  login,
  getMe,
  getUsers,
  updateUserStatus,
  getRecruiters,
  getRecruiterDetails,
  createRecruiter,
} = require("../controllers/auth.controller");

const validate = require("../middleware/validate.middleware");

const {
  signupSchema,
  loginSchema,
  updateUserStatusSchema,
  createRecruiterSchema,
} = require("../validators/auth.validator");

const authMiddleware = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, getMe);
router.get("/users", authMiddleware, allowRoles("admin"), getUsers);
router.patch(
  "/users/:id/status",
  authMiddleware,
  allowRoles("admin"),
  validate(updateUserStatusSchema),
  updateUserStatus,
);

router.get("/recruiters", authMiddleware, allowRoles("admin"), getRecruiters);

router.post(
  "/recruiters",
  authMiddleware,
  allowRoles("admin"),
  validate(createRecruiterSchema),
  createRecruiter,
);

router.get(
  "/recruiters/:recruiterId",
  authMiddleware,
  allowRoles("admin"),
  getRecruiterDetails,
);

module.exports = router;
