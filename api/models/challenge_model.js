import mongoose from "mongoose";

const testcaseSchema = new mongoose.Schema({
  inputs: { type: [mongoose.Schema.Types.Mixed], required: true }, // Array to handle multiple inputs
  expected_output: { type: String, required: true },
});

const challengeDescriptionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  input_format: { type: String, required: true },
  output_format: { type: String, required: true },
  constraints: { type: String, required: true },
});

const skeletonCodeSchema = new mongoose.Schema({
  language: { type: String, required: true },
  code: { type: String, required: true },
});

const challengeSchema = new mongoose.Schema(
  {
    challenge_title: { type: String, required: true }, // Renamed from challenge_name
    challenge_description: { type: challengeDescriptionSchema, required: true },
    challenge_difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    users_attempted: { type: Number, default: 0 },
    users_solved: { type: Number, default: 0 },
    languages_supported: { type: [String], required: true },
    daily_challenge: { type: Date },
    test_cases: [testcaseSchema], // Updated from challenge_testcases
    challenge_solutions: { type: [String], required: false },
    skeleton_code: skeletonCodeSchema, // New field for skeleton code
    hints: { type: [String], default: [] }, // New field for hints
    subject_tags: { type: [String], default: [], required: false }, // New field for subject_tags
    content_tags: { type: [String], default: [], required: false }, // New field for content_tags
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
