import mongoose from "mongoose";

const testcaseSchema = new mongoose.Schema({
  language: { type: String, required: true },
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const challengeSchema = new mongoose.Schema(
  {
    question_name: { type: String, required: true },
    question_description: { type: String, required: true },
    question_difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    question_type: { type: String, required: true },
    users_attempted: { type: Number, default: 0 },
    users_solved: { type: Number, default: 0 },
    languages_supported: { type: [String], required: true },
    daily_question: { type: Date },
    subject: { type: String, required: true },
    question_testcases: [testcaseSchema],
    question_solutions: { type: [String], required: true },
  },
  { timestamps: true }
);

const Challenge = mongoose.model("Challenge", challengeSchema);
export { Challenge };