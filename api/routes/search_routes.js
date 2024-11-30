import express from 'express';
import * as searchController from '../controllers/search_controller.js';

const router = express.Router();

router.route('/').get(searchController.searchChallenges);

export default router;