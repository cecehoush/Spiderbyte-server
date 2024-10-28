import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  related_problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  image: { type: String }
}, { timestamps: true });


export default mongoose.model('Subject', subjectSchema);