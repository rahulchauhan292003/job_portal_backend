const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      default: () => randomUUID(),
    },

    label: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "textarea", "number", "dropdown", "checkbox", "boolean"],
      required: true,
    },

    required: {
      type: Boolean,
      default: false,
    },

    options: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Job", jobSchema);
