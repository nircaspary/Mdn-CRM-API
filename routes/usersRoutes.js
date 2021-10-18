const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

router.get('/search', authController.protect, userController.searchUsers);
router.get('/pages', authController.protect, userController.getPages);
router.get('/me', authController.protect, userController.getMe);
router.delete('/:id', authController.protect, userController.deleteUser);
router.get('/:id', userController.findUser);

// Because middleware stack goes one after another, all routes on this router that are under this middleware function, will be effected by the protect function
router.use(authController.protect);
router.patch('/me', userController.updateMe);

// Because middleware stack goes one after another, all routes on this router that are under this middleware function, will be effected by the restrictTo function AND the protect function
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router.route('/').post(userController.createUser);
router.route('/:id').patch(userController.updateUser);

module.exports = router;
