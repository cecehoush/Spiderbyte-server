import Subject from '../models/subject_model.js';
import Challenge from '../models/challenge_model.js';

// Fetch all subjects
export async function getSubjects(req, res) {
    try {
        const subjects = await Subject.find();
        return res.status(200).json(subjects);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function assignQuestionToSubjects(req, res) {
    try {
        console.log('Request Body:', req.body);

        const subjectNames = req.body.subjects;
        const challengeTitle = req.body.challenge_title;

        // Validate the request body
        if (!subjectNames || !challengeTitle) {
            return res.status(400).json({ error: 'Subjects and challenge title are required' });
        }

        // Find the challenge by its title
        const challenge = await Challenge.findOne({ challenge_name: challengeTitle });
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        // Find subjects by their names
        const subjects = await Subject.find({ name: { $in: subjectNames } });

        if (subjects.length === 0) {
            return res.status(404).json({ error: 'No subjects found' });
        }

        // Ensure `subject._id` is used correctly
        for (let subject of subjects) {
            if (!mongoose.Types.ObjectId.isValid(subject._id)) {
                console.error(`Invalid ObjectId for subject: ${subject.name}`);
                continue;
            }

            await Subject.findByIdAndUpdate(
                subject._id,
                { $addToSet: { related_problems: challenge._id } },
                { new: true }
            );
        }

        return res.status(200).json({ message: 'Challenge assigned to subjects successfully' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
}



// Create a new subject
export async function createSubject(req, res) {
    try {
        const subject = await Subject.create(req.body);
        return res.status(201).json(subject);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// Fetch the first 20 subjects
export async function getSomeSubjects(req, res) {
    try {
        const subjects = await Subject.find().limit(20);
        return res.status(200).json(subjects);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// Fetch a specific subject by its ID
export async function getSubjectById(req, res) {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        return res.status(200).json(subject);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function getChallengesBySubjectId(req, res) {
    try {
        // Step 1: Find the Subject by its ID
        const subject = await Subject.findById(req.params.subjectId);
        
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        // Step 2: Use the related_problems array to fetch each referenced Challenge
        const challenges = await Challenge.find({
            _id: { $in: subject.related_problems }
        });

        // Return the array of challenge documents
        return res.status(200).json(challenges);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function getChallengesBySubjectName(req, res) {
    try {
        // Step 1: Find the Subject by its `name` field
        const subject = await Subject.findOne({ name: req.params.name });
        
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        // Step 2: Use the related_problems array to fetch each referenced Challenge
        const challenges = await Challenge.find({
            _id: { $in: subject.related_problems }
        });

        // Return the array of challenge documents
        return res.status(200).json(challenges);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function updateSubject
(req, res) {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        return res.status(200).json(subject);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}