const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await authService.getUsers();

  res.status(200).json({
    success: true,
    data: users,
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await authService.updateUserStatus(
    req.params.id,
    req.body.status,
  );

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: user,
  });
});

const getRecruiters = asyncHandler(async (req, res) => {
  const recruiters = await authService.getRecruiters();

  res.status(200).json({
    success: true,
    data: recruiters,
  });
});

const getRecruiterDetails = asyncHandler(async (req, res) => {
  // console.log("id-----",req.params.recruiterId);
  const recruiter = await authService.getRecruiterDetails(
    req.params.recruiterId,
  );

  res.status(200).json({
    success: true,
    data: recruiter,
  });
});

const createRecruiter = asyncHandler(async (req, res) => {
  const recruiter = await authService.createRecruiter(req.body);

  res.status(201).json({
    success: true,
    message: "Recruiter created successfully",
    data: recruiter,
  });
});

module.exports = {
  signup,
  login,
  getMe,
  getUsers,
  updateUserStatus,
  getRecruiters,
  getRecruiterDetails,
  createRecruiter,
};
