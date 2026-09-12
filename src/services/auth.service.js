const bcrypt = require("bcryptjs");

const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const Job = require("../models/Job");
const Application = require("../models/Application");

const signup = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw new ApiError(403, `Your account is ${user.status}`);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const getUsers = async () => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return users;
};

const updateUserStatus = async (userId, status) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(403, "Admin status cannot be changed");
  }

  user.status = status;

  await user.save();

  return user;
};

const getRecruiters = async () => {
  return User.find({ role: "recruiter" })
    .select("-password")
    .sort({ createdAt: -1 });
};

const getRecruiterDetails = async (recruiterId) => {

  // console.log("-->",recruiterId)
  const recruiter = await User.findOne({
    _id: recruiterId,
    role: "recruiter",
  }).select("-password");

  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  const jobs = await Job.aggregate([
    {
      $match: {
        createdBy: recruiter._id,
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

  const totalApplications = jobs.reduce(
    (total, job) => total + job.applicantCount,
    0,
  );

  return {
    recruiter,
    stats: {
      totalJobs: jobs.length,
      totalApplications,
      activeJobs: jobs.length,
    },
    jobs,
  };
};

module.exports = {
  signup,
  login,
  getUsers,
  updateUserStatus,
    getRecruiters,
  getRecruiterDetails,
};
