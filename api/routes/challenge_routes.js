import express from 'express';
import * as challengeController from '../controllers/challenge_controller.js';

const router = express.Router();

router.route('/').get(challengeController.getChallenges);
router.route('/').post(challengeController.createChallenge);

router.route('/name/:title')
    .get(challengeController.getChallengeByName);

router.route('/some')
    .get(challengeController.getSomeChallenges);


router.route('/:id')
    .get(challengeController.getChallengeById);

router.route('/getquestion')
    .post(challengeController.createNewChallenge)

export default router;