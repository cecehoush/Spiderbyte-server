import express from 'express';
import * as tagController from '../controllers/tag_controller.js';


const router = express.Router();

router.route('/')
    .get(tagController.getAllTags)
    .post(tagController.createTag);


export default router;