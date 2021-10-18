const Joi = require('joi');

const regex = { cellPhone: /^0[2-9]\d{7,8}$/ };

exports.faultSchema = Joi.object({
  subject: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  images: Joi.optional(),
  user_id: Joi.string().required().trim(),
});

exports.loginSchema = Joi.object({
  id: Joi.string().required().length(9).trim(),
  password: Joi.string().required().trim(),
});

exports.userSchema = Joi.object({
  id: Joi.string().trim().length(9),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().required().email(),
  cellPhone: Joi.string().trim().regex(regex.cellPhone).length(10),
  officePhone: Joi.string().trim().length(7),
  location: Joi.object().keys({
    building: Joi.string().trim().required(),
    floor: Joi.number().required(),
    roomNumber: Joi.number().required(),
  }),
  computerName: Joi.string().trim().length(5),
  role: Joi.optional(),
});

exports.userWithPasswordSchema = Joi.object({
  id: Joi.string().trim().length(9),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().required().email(),
  cellPhone: Joi.string().trim().regex(regex.cellPhone).length(10),
  officePhone: Joi.string().trim().length(7),
  location: Joi.object().keys({
    building: Joi.string().trim().required(),
    floor: Joi.number().required(),
    roomNumber: Joi.number().required(),
  }),
  computerName: Joi.string().trim().length(5),
  role: Joi.string().trim().required().valid('user', 'admin', 'help desk', 'tech', 'lab', 'info'),
  password: Joi.string().trim().required(),
  passwordConfirm: Joi.ref('password'),
});

exports.changePasswordSchema = Joi.object({
  passwordCurrent: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  passwordConfirm: Joi.ref('password'),
});

exports.passwordSchema = Joi.object({
  password: Joi.string().trim().required(),
  passwordConfirm: Joi.ref('password'),
});

exports.emailSchema = Joi.object({ email: Joi.string().trim().required().email() });

exports.validate = (schema, body) => schema.validate(body);
