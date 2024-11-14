import mongoose from 'mongoose';

// Constants for special user handling
const SPECIAL_USER_ID = '000000000000000000000000';

const submissionSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false,
    default: SPECIAL_USER_ID,
    get: v => v?.toString() || SPECIAL_USER_ID,
    set: function(v) {
      if (v === -1 || v === '-1') {
        return new mongoose.Types.ObjectId(SPECIAL_USER_ID);
      }
      if (!v) {
        return new mongoose.Types.ObjectId(SPECIAL_USER_ID);
      }
      try {
        return new mongoose.Types.ObjectId(v.toString());
      } catch (error) {
        return new mongoose.Types.ObjectId(SPECIAL_USER_ID);
      }
    }
  },
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: false },
  challenge_name: {type: String, required: false},
  code: { type: String, required: true },
  language: { type: String, required: true },
  output: { type: String, required: false },
  valid_solution: { type: Boolean, required: false },
  submitted_at: { type: Date, default: Date.now },
  execution_time_ms: { type: Number },
  error_messages: { type: String, default: 'None' }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

// Helper function for creating submissions
async function createSubmission(data) {
  try {
    const submission = new Submission({
      ...data,
      user_id: data.user_id === -1 ? SPECIAL_USER_ID : data.user_id
    });
    return await submission.save();
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
}

export { Submission, createSubmission, SPECIAL_USER_ID };