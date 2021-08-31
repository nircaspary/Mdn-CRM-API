const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router.get('/search', authController.protect, userController.searchUsers);
router.route('/:id').get(userController.findUser).delete(userController.deleteUser);
// Because middleware stack goes one after another, all routes on this router that are under this middleware function, will be effected by the protect function
router.use(authController.protect);
router.route('/pages').get(userController.getPages);
router.patch('/me', userController.updateMe);
router.get('/me', userController.getMe);

// Because middleware stack goes one after another, all routes on this router that are under this middleware function, will be effected by the restrictTo function AND the protect function
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').patch(userController.updateUser);

module.exports = router;
