const yup = require("yup");

const answerSchema = yup.object({
  questionId: yup.string().trim().required("Question ID is required"),

  answer: yup.mixed().required("Answer is required"),
});

const applySchema = yup.object({
  answers: yup
  .array()
  .default([])
});

const bulkApplySchema = yup.object({
  jobIds: yup
    .array()
    .min(1, "At least one job is required")
    .required("Job IDs are required"),

  answersByJob: yup.mixed().required("Answers are required"),
});

const updateStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(
      ["applied", "reviewing", "shortlisted", "rejected", "hired"],
      "Invalid application status",
    )
    .required("Status is required"),
});

module.exports = {
  applySchema,
  bulkApplySchema,
  updateStatusSchema,
};
