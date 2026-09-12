const yup = require("yup");

const questionSchema = yup.object({
  questionId: yup.string().trim().optional(),

  label: yup.string().trim().required("Question label is required"),

  type: yup
    .string()
    .oneOf(
      ["text", "textarea", "number", "dropdown", "checkbox", "boolean"],
      "Invalid question type",
    )
    .required("Question type is required"),

  required: yup.boolean().default(false),

  options: yup.array().of(yup.string().trim()).default([]),
});

const createJobSchema = yup.object({
  title: yup.string().trim().required("Job title is required"),

  company: yup.string().trim().required("Company is required"),

  location: yup.string().trim().required("Location is required"),

  description: yup.string().trim().required("Description is required"),

  questions: yup
  .array()
  .of(questionSchema)
  .default([]),
});

module.exports = {
  createJobSchema,
};
