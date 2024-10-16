import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  related_problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
