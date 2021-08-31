const FaultLog = require('../models/faultLogsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createFaultLog = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.fault) req.body.fault = req.params.faultId;
  if (!req.body.user) req.body.user = req.user._id;

  const faultLog = await FaultLog.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      faultLog,
    },
  });
});

exports.getAllFaultLogs = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.faultId) filter = { fault: req.params.faultId };
  const faultLogs = await FaultLog.find(filter);

  res.status(200).json({
    status: 'success',
    results: faultLogs.length,
    data: {
      faultLogs,
    },
  });
});

exports.deleteFaultLog = catchAsync(async (req, res, next) => {
  const faultLog = await FaultLog.findOneAndDelete(req.params.id);

  if (!faultLog) return next(new AppError(`No FaultLog found with that ID`, 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
