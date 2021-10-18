const User = require('../models/usersModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { validate, userSchema, userWithPasswordSchema } = require('../utils/joiSchema');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query).filter().sort().limitFields().paginate();
  // Number of results divided by limit per page
  // const results = await User.find();
  // const pages = Math.ceil(results.length / features.query.options.limit);
  const users = await features.query;

  res.status(200).json({
    status: 'succses',
    data: {
      users,
    },
  });
});
exports.searchUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query, 'search').filter().paginate().limitFields();
  const data = await features.query;

  res.status(200).json({
    status: 'succses',
    data,
  });
});

exports.findUser = catchAsync(async (req, res, next) => {
  if (req.params.id === 'me') return next();
  const user = await User.findOne({ id: req.params.id });
  if (!user) return next(new AppError('there is no user with that id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { error } = validate(req.body.role !== 'user' ? userWithPasswordSchema : userSchema, req.body);
  if (error) return next(new AppError(error.message, 400));
  // If passed the validation create user
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const me = await User.findOne({ id: req.user.id });

  res.status(200).json({
    status: 'succses',
    data: {
      user: me,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { error } = validate(req.body.role !== 'user' ? userWithPasswordSchema : userSchema, req.body);
  if (error) return next(new AppError(error.message, 400));

  // If passed the validation update user
  const user = await User.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true, upsert: false });
  res.status(201).json({
    status: 'success',
    data: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Joi validate
  const { error } = validate(userSchema, req.body);
  if (error) return next(new AppError(error.message, 400));

  // Check if a user tries to change his role
  if (req.body.role !== req.user.role) return next(new AppError('You not allowed to change your role!', 403));
  // Update user document
  const updatedMe = await User.findOneAndUpdate({ id: req.user.id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    updatedMe,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await User.findOneAndDelete({ id: req.params.id });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getPages = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const pages = Math.ceil(users.length / 10);

  res.status(200).json({
    status: 'success',
    data: {
      pages,
    },
  });
});
