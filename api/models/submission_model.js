import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  output: { type: String, required: false }, // The frontend will not have this field until the submission is complete
  valid_solution: { type: Boolean, required: false }, // same here
  submitted_at: { type: Date, default: Date.now },
  execution_time_ms: { type: Number },
  error_messages: { type: String, default: 'None' }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
export { Submission };
