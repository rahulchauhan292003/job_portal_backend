const yup = require("yup");

const signupSchema = yup.object({
  name: yup.string().trim().required("Name is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup.string().required("Password is required"),
});

const updateUserStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(["active", "inactive", "blocked"], "Invalid user status")
    .required("Status is required"),
});

const createRecruiterSchema = yup.object({
  name: yup.string().trim().required("Name is required"),

  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

module.exports = {
  signupSchema,
  loginSchema,
  updateUserStatusSchema,
  createRecruiterSchema,
};
