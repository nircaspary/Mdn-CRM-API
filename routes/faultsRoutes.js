const express = require('express');
const router = express.Router();
const faultController = require('../controllers/faultsController');
const authController = require('../controllers/authController');
const faultLogsRouter = require('./faultLogsRoutes');

router.post('/', faultController.uploadImages, faultController.saveImages, faultController.createFault);

// Because middleware stack goes one after another, all routes on this router that are under this middleware function, will be effected by the protect function
router.use(authController.protect);

router.route('/').get(faultController.getAllFaults);
router.route('/search').get(faultController.searchFaults);
router.route('/pages').get(faultController.getPages);
router
  .route('/:id')
  .get(faultController.findFault)
  .patch(faultController.updateFault)
  .delete(authController.restrictTo('admin'), faultController.deleteFault);

router.use('/:faultId/faultLogs', faultLogsRouter);

module.exports = router;
