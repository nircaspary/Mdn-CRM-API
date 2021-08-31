const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Fault = require('./faultsModel');

const userSchema = new mongoose.Schema(
  {
    id: {
      unique: true,
      type: String,
      required: [true, 'You must fill your ID'],
    },
    firstName: {
      type: String,
      required: [true, 'You must fill your first name'],
    },
    lastName: {
      type: String,
      required: [true, 'You must fill your last name'],
    },
    email: {
      type: String,
      required: [true, 'You must fill your email'],
      lowercase: true,
      unique: [true, 'There is already an account with that email adress'],
      // validate: [validator.isEmail, 'Please enter a valid email'],
    },
    cellPhone: {
      type: String,
      required: [true, 'You must fill your phone Number'],
    },
    officePhone: {
      type: String,
      // minlength: 5,
    },
    location: {
      building: {
        type: String,
        // required: [true, 'You must fill your Location'],
      },
      floor: {
        type: String,
        // required: [true, 'You must fill your fault floor Location'],
      },
      roomNumber: {
        type: String,
        // required: [true, 'You must fill your room number Location'],
      },
    },
    computerName: {
      type: String,
      // minlength: 5,
      // maxlength: 5,
      required: [true, 'You must fill your computer Name'],
    },
    role: {
      type: String,
      enum: ['help desk', 'tech', 'info', 'lab', 'admin', 'user'],
      default: 'user',
    },

    // The 'select' makes sure that the password never will send with any output
    password: { type: String, select: false },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ role: 1 });
userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ id: 1 });
userSchema.index({ location: 1 });

userSchema.post('findOneAndDelete', async function (doc, next) {
  await Fault.deleteMany({ user_id: doc._id });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password || !this._update.$set.password) return next();
  this._update.$set.password = await bcrypt.hash(this._update.$set.password, 12);
  this._update.$set.passwordConfirm = undefined;
  next();
});
// Set Password changed at property when password is modified and the document is not new
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

// Check if user changed password after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    // if the token was created before the user changed his password return true
    return JWTTimestamp < changedTimestamp;
  }
  // False mean that the password never changed
  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  // Creates a strong password reset token string
  const resetToken = crypto.randomBytes(32).toString('hex');

  // A basic hashing operation to make sure that the token string is hashed on the DB
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('user', userSchema);
module.exports = User;
