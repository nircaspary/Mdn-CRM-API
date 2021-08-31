const express = require('express');

const faultLogsController = require('../controllers/faultLogsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Apply the protect middleware on all the routes in this router
router.use(authController.protect);

router.route('/').get(faultLogsController.getAllFaultLogs).post(faultLogsController.createFaultLog);

router.route('/:id').delete(authController.restrictTo('admin'), faultLogsController.deleteFaultLog);

module.exports = router;
