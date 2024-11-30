import Challenge from '../models/challenge_model.js';
import Subject from '../models/subject_model.js';

export async function searchChallenges(req, res) {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // Search challenges by title (case-insensitive)
        const challenges = await Challenge.find({ 
            challenge_title: { $regex: query, $options: 'i' } 
        }).limit(5);

        // Search subjects by name (case-insensitive)
        const subjects = await Subject.find({ 
            name: { $regex: query, $options: 'i' } 
        }).limit(5);

        // Combine and format results
        const results = [
            ...challenges.map(challenge => ({
                _id: challenge._id,
                name: challenge.challenge_title,
                type: 'challenge'
            }))
        ];

        res.status(200).json(results);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}