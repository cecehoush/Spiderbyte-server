import express from 'express';
import * as userController from '../controllers/user_controller.js'; 

const router = express.Router();

router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/signup')
    .post(userController.signup);

router.route('/signin')
    .post(userController.signin);

router.route('/:userId/tags/subject')
    .put(userController.updateUserSubjectTags)
    .delete(userController.removeUserSubjectTags);

router.route('/:userId/tags/content')
    .put(userController.updateUserContentTags)
    .delete(userController.removeUserContentTags);

export default router;