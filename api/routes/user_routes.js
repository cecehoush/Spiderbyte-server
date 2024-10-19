import express from 'express';
import * as userController from '../controllers/user_controller.js'; 

// Create a new router using express
const router = express.Router();

// Define routes for /api/users
router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

export default router;