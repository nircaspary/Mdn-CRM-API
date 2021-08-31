const mongoose = require('mongoose');

const faultSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: function () {
        const id = mongoose.Types.ObjectId().toString();
        return id.substr(id.length - 5);
      },

      unique: true,
    },
    subject: {
      type: String,
      required: [true, 'You must fill fault subject'],
      // minlength: 10,
    },
    description: {
      type: String,
      required: [true, 'You must fill fault description'],
      // minlength: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: [true, 'You must fill your ID'],
    },

    fileUpload: String,

    team: {
      type: String,
      default: 'help desk',
      enum: ['help desk', 'tech', 'lab', 'info'],
    },
    isDone: { type: String, default: 'Not Complete', enum: ['Complete', 'Not Complete'] },
    completed_at: { type: String, default: 'Not Complete' },
    images: Array,
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Virtual populate
faultSchema.virtual('logs', {
  ref: 'faultLog',
  foreignField: 'fault',
  localField: '_id',
});

faultSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user_id', select: '-__v -passwordResetToken -passwordChangedAt' });
  next();
});

const Fault = mongoose.model('fault', faultSchema);
module.exports = Fault;
