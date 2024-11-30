import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  is_public: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Playlist', playlistSchema);
