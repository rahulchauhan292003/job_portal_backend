const Job = require("../models/Job");

const jobs = [
  {
    jobId: "job-1",
    title: "Frontend Developer",
    company: "Nova Labs",
    location: "Remote",
    description: "Build and maintain our React-based dashboard.",
    questions: [
      {
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        label: "Years of React experience",
        type: "number",
        required: true,
      },
      {
        label: "Preferred work mode",
        type: "dropdown",
        required: true,
        options: ["Remote", "Hybrid", "On-site"],
      },
      {
        label: "Why do you want this role?",
        type: "textarea",
        required: false,
      },
    ],
  },

  {
    jobId: "job-2",
    title: "Content Writer",
    company: "Brightside Media",
    location: "Hybrid",
    description: "Write long-form articles and marketing copy.",
    questions: [
      {
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        label: "Portfolio URL",
        type: "text",
        required: true,
      },
      {
        label: "Topics you can write about",
        type: "checkbox",
        required: true,
        options: ["Tech", "Finance", "Health", "Travel", "Lifestyle"],
      },
      {
        label: "Sample pitch",
        type: "textarea",
        required: true,
      },
    ],
  },

  {
    jobId: "job-3",
    title: "Sales Associate",
    company: "PeakReach",
    location: "On-site",
    description: "Drive outbound sales and manage client relationships.",
    questions: [
      {
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        label: "Do you have a driver's license?",
        type: "boolean",
        required: true,
      },
      {
        label: "Highest education",
        type: "dropdown",
        required: true,
        options: ["High School", "Bachelor's", "Master's", "Other"],
      },
      {
        label: "Notice period (in days)",
        type: "number",
        required: false,
      },
    ],
  },
];

const seedJobs = async () => {
  try {
    const count = await Job.countDocuments();

    if (count === 0) {
      await Job.insertMany(jobs);

      console.log("Jobs seeded successfully");
    } else {
      console.log("Jobs already exist, skipping seed");
    }
  } catch (error) {
    console.error("Job seeding failed:", error.message);
  }
};

module.exports = seedJobs;
