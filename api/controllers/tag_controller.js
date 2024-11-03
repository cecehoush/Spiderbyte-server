import Tag from '../models/tag_model.js';

export async function getAllTags(req, res) {
    try {
        const tags = await Tag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function createTag(req, res) {
    const tag = new Tag({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}