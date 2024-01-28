const express = require('express');


const userController = require('../controller/user-controller');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect) /**this is middleware for protect all below router  */

router.patch('/update-my-password', authController.updatePassword);
router.patch('/updateMe',userController.uploadUserPhoto ,userController.resizeUserPhoto,userController.updateMe);
router.delete('/deleteMe',userController.deleteMe);
router.get('/me',userController.getMe,userController.getUser)

router.use(authController.restrictTo('admin'))
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.UpdateUser)
    .delete(userController.deleteUser);

module.exports = router;