import express from 'express';
import * as problemController from '../controllers/problem_controller.js';

const router = express.Router();

router.route('/')
    .get(problemController.getChallenges)
    .post(problemController.createChallenge);

router.route('/some')
    .get(problemController.getSomeChallenges);


router.route('/:id')
    .get(problemController.getChallengeById);

export default router;