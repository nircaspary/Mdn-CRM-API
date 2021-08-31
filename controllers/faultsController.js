const multer = require('multer');
const sharp = require('sharp');
const Fault = require('../models/faultsModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadImages = upload.array('images', 3);

exports.saveImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `Fault-${req.body.user_id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer).toFormat('jpeg').toFile(`public/images/faults/${filename}`);
      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllFaults = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') req.query.team = req.user.role;

  const features = new APIFeatures(Fault.find(), req.query).filter().sort().limitFields().paginate();
  const faults = await features.query;

  res.status(200).json({
    status: 'succses',
    data: {
      faults,
    },
  });
});
exports.searchFaults = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin') req.query.team = req.user.role;

  const features = new APIFeatures(Fault.find(), req.query, 'search').filter().paginate().limitFields();
  const data = await features.query;

  res.status(200).json({
    status: 'succses',
    data,
  });
});

exports.createFault = catchAsync(async (req, res, next) => {
  const newFault = await Fault.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      fault: newFault,
    },
  });
});

exports.findFault = catchAsync(async (req, res, next) => {
  const fault = await Fault.findById(req.params.id).populate('logs');
  if (req.user.role !== 'admin' && fault.team !== req.user.role) return next(new AppError('You have no premission to get this fault'));
  if (!fault) return next(new AppError(`No tour found with that ID`, 404));

  res.status(200).json({
    status: 'success',
    data: {
      fault,
    },
  });
});

exports.updateFault = catchAsync(async (req, res, next) => {
  const fault = await Fault.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('user_id');

  if (!fault) return next(new AppError(`No tour found with that ID`, 404));

  res.status(200).json({
    status: 'success',
    data: {
      fault,
    },
  });
});

exports.deleteFault = catchAsync(async (req, res, next) => {
  const fault = await Fault.findOneAndDelete(req.params.id);

  if (!fault) return next(new AppError(`No fault found with that ID`, 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getPages = catchAsync(async (req, res, next) => {
  const faults = await Fault.find();
  const pages = Math.ceil(faults.length / 10);

  res.status(200).json({
    status: 'success',
    data: {
      pages,
    },
  });
});
