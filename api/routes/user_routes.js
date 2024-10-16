import express from 'express';
import * as userController from '../controllers/user_controller.js'; 

const router = express.Router();

router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

export default router;