import { Schema, model } from 'mongoose';

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

const Tag = model('Tag', tagSchema);

export default Tag;