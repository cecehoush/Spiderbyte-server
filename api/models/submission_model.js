import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  output: { type: String, required: true },
  valid_solution: { type: Boolean, required: true },
  submitted_at: { type: Date, default: Date.now },
  execution_time_ms: { type: Number },
  error_messages: { type: String, default: 'None' }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
