const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.post('/login', authController.login);
router.post('/signup/:id', authController.signup);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

module.exports = router;
