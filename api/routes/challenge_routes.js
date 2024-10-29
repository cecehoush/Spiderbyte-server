import express from 'express';
import * as challengeController from '../controllers/challenge_controller.js';

const router = express.Router();

router.route('/')
    .get(challengeController.getChallenges)
    .post(challengeController.createChallenge);

router.route('/some')
    .get(challengeController.getSomeChallenges);


router.route('/:id')
    .get(challengeController.getChallengeById);

export default router;