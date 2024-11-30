import express from 'express';
import * as challengeController from '../controllers/challenge_controller.js';

const router = express.Router();

router.route('/').get(challengeController.getChallenges);
router.route('/').post(challengeController.createChallenge);

router.route('/name/:title')
    .get(challengeController.getChallengeByName);

router.route('/some')
    .get(challengeController.getSomeChallenges);

// Get challenges by a list of challenge IDs
router.post('/by-ids', challengeController.getChallengesByIds);

router.route('/:id')
    .get(challengeController.getChallengeById);

export default router;