// Make controller to get all subjects

import Subject from '../models/subject_model.js';

export async function getSubjects(req, res) {
    try {
        const subjects = await Subject.find();
        return res.status(200).json(subjects);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
    }

export async function createSubject(req, res) {
    try {
        const subject = await Subject.create(req.body);
        return res.status(201).json(subject);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
    }

// Route to get the first 20 subjects
export async function getSomeSubjects(req, res) {
    try {
        const subjects = await Subject.find().limit(20);
        return res.status(200).json(subjects);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}