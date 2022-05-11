const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const { validate, loginSchema, changePasswordSchema, passwordSchema, emailSchema, userSchema } = require('../utils/joiSchema');

const User = require('../models/usersModel');

const signToken = (user) => {
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWTKEY, { expiresIn: process.env.JWT_EXPIRATION });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);

  // send cookie
  const cookieOptions = { expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION) * 24 * 60 * 60 * 1000, httpOnly: true };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'sucsses',
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { error } = validate(loginSchema, req.body);
  if (error) return next(new AppError(error.message, 400));
  const { id, password } = req.body;
  //   Check if user exist && password is correct
  const user = await User.findOne({ id }).select('+password');

  if (!user || user.role === 'user' || !(await user.correctPassword(password, user.password)))
    return next(new Error('Incorrect id or password', 401));

  //   send token to the client
  createSendToken(user, 200, res);
});

// This route is for the regular user auto creation on the fault creation form.
exports.signup = catchAsync(async (req, res, next) => {
  // For security reasons that not everybody could enter role
  if (req.body.role) req.body.role = 'user';
  // Joi Validation

  const { error } = validate(userSchema, req.body);
  if (error) return next(new AppError(error.message, 400));
  const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, {
    upsert: true,
    $set: req.body,
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check if it's thete'
  let token;
  if (req.header('x-auth-token')) token = req.header('x-auth-token');
  if (!token) return next(new AppError('You dont have premission to see this content, please log in to get access', 401));
  // Verification token
  const decoded = jwt.verify(token, process.env.JWTKEY);
  // Check if user still exist
  const freshUser = await User.findOne({ id: decoded.id });

  if (!freshUser || freshUser.role === 'user') return next(new AppError('The user belonging to this token does not exist'));

  if (freshUser.changedPasswordAfter(decoded.iat)) return next(new AppError('User recently changed password! Please log in again', 401));

  // Grant access to projected route
  req.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Roles is an array
    if (!roles.includes(req.user.role)) return next(new AppError('You dont have premission to perform this action', 403));
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { error } = validate(emailSchema, req.body);
  if (error) return next(new AppError(error.message, 400));
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user || user.role === 'user') return next(new AppError('There is no user with that email adress', 403));
  // generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send it back as an email
  try {
    let resetURL;
    if (process.env.NODE_ENV === 'production') resetURL = `${req.protocol}://${req.get('host')}/login/forgot-password/auth/${resetToken}`;
    else resetURL = `http://localhost:3000/login/forgot-password/auth/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email!',
    });
  } catch (err) {
    // if there is an error with sending the email, we need to clear the token
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(err, 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { error } = validate(passwordSchema, req.body);
  if (error) return next(new AppError(error.message, 400));
  // Get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

  // if token not expired, and there is a user, set the new password
  if (!user) return next(new AppError('Token is invalid or expired', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // Update changedPasswordAt property for the user: This is in the userModel as a pre save middleware function

  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { error } = validate(changePasswordSchema, req.body);
  if (error) return next(new AppError(error.message, 400));
  // Get user from collection
  const user = await User.findOne({ id: req.user.id }).select('+password');
  // check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) return next(new AppError('Your current password is wrong', 401));
  // If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // Log user in
  createSendToken(user, 200, res);
});
