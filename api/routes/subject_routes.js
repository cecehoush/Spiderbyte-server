// Make route to get all subjects

import express from 'express';
import * as subjectController from '../controllers/subject_controller.js';


const router = express.Router();

router.route('/')
    .get(subjectController.getSubjects)
    .post(subjectController.createSubject);


router.route('/some')
    .get(subjectController.getSomeSubjects);


router.route('/:id')
    .get(subjectController.getSubjectById);


router.route('/:subjectId/problems')
    .get(subjectController.getChallengesBySubjectId);

router.route('/name/:name/problems')
    .get(subjectController.getChallengesBySubjectName);


export default router;