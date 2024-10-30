import Challenge from '../models/challenge_model.js';
import Subject from '../models/subject_model.js';

export async function getChallenges(req, res) {
    try {
        const challenges = await Challenge.find();
        return res.status(200).json(challenges);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export async function createChallenge(req, res) {
    try {
        const challenge = await Challenge.create(req.body);
        return res.status(201).json(challenge);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

// Route to get the first 20 challenges
export async function getSomeChallenges(req, res) {
    try {
        const challenges = await Challenge.find().limit(20);
        return res.status(200).json(challenges);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

// Route to get a specific challenge by its ID
export async function getChallengeById(req, res) {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }
        return res.status(200).json(challenge);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

