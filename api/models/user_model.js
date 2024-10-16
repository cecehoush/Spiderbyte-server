import mongoose from 'mongoose';

const solvedProblemSchema = new mongoose.Schema({
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  solved_at: { type: Date, required: true }
});

const attemptedProblemSchema = new mongoose.Schema({
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  attempts: { type: Number, default: 0 },
  last_attempt_at: { type: Date, required: true }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profile_picture: { type: String },
  solved_problems: [solvedProblemSchema],
  attempted_problems: [attemptedProblemSchema],
  created_playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  preferences: {
    language: { type: String, default: 'Python' },
    content_tags: { type: [String], default: [] }
  },
  join_date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);