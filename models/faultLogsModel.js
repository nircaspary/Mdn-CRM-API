const mongoose = require('mongoose');

const faultLogSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'You must fill fault description'],
      // minlength: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    team: {
      type: String,
      enum: ['help desk', 'tech', 'lab', 'info'],
      required: [true, 'Log must have a team'],
    },
    fault: {
      type: mongoose.Schema.ObjectId,
      ref: 'fault',
      required: [true, 'Log must belong to a fault'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'Log must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

faultLogSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'firstName lastName _id' });
  next();
});

const FaultLog = mongoose.model('faultLog', faultLogSchema);
module.exports = FaultLog;
