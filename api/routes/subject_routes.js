// Make route to get all subjects

import express from 'express';
import * as subjectController from '../controllers/subject_controller.js';

const router = express.Router();

router.route('/')
    .get(subjectController.getSubjects)
    .post(subjectController.createSubject);

export default router;