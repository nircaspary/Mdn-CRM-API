import * as yup from 'yup';

const regex = {
  cellPhone: /^0[2-9]\d{7,8}$/,
};

export const faultSchema = yup.object().shape({
  id: yup.string().trim().length(9, { message: 'Id must be 9 characters long' }),
  firstName: yup.string().trim().required({ message: 'You must provide a first name' }),
  lastName: yup.string().trim().required({ message: 'You must provide a last name' }),
  email: yup
    .string()
    .trim()
    .required({ message: 'You must provide an Email adress' })
    .matches(regex.email, { message: 'Please enter a valid email' }),
  cellPhone: yup
    .string()
    .trim()
    .length(10, { message: 'Cell phone must be 10 characters long' })
    .matches(regex.cellPhone, { message: 'Please enter a valid phone number' }),
  officePhone: yup.string().trim().length(7, { message: 'Office phone must be 7 digit number' }),
  computerName: yup.string().trim().length(5, { message: 'Computer name Must be 5 digit number' }),
  description: yup
    .string()
    .trim()
    .required({ message: 'You must provide a description' })
    .max(4000, { message: 'Too many characters, please write less than 4000 characters' }),
  subject: yup.string().trim().required({ message: 'You must provide a subject' }),
});

export const userSchema = yup.object().shape({
  id: yup.string().trim().length(9, { message: 'Id must be 9 characters long' }),
  firstName: yup.string().trim().required({ message: 'You must provide a first name' }),
  lastName: yup.string().trim().required({ message: 'You must provide a last name' }),
  email: yup.string().trim().required({ message: 'You must provide an Email adress' }).email({ message: 'Please enter a valid email' }),
  cellPhone: yup
    .string()
    .trim()
    .matches(regex.cellPhone, { message: 'Please enter a valid phone number' })
    .length(10, { message: 'Cell phone must be 10 characters long' }),

  officePhone: yup.string().trim().length(7, { message: 'Office phone must be 7 characters long' }),
  computerName: yup.string().trim().length(5, { message: 'Computer name Must be 5 digit number' }),
});

export const loginSchema = yup.object().shape({
  id: yup.string().trim().length(9, { message: 'Id must be 9 characters long' }),
  password: yup.string().trim().required({ message: 'You must provide a password' }),
});

export const locationSchema = yup.object().shape({
  floor: yup.string().trim().required({ message: 'You must provide a floor' }),
  building: yup.string().trim().required({ message: 'You must provide a building' }),
  roomNumber: yup.string().trim().required({ message: 'You must provide a room number' }),
});

export const passwordSchema = yup.object().shape({
  currentPassword: yup.string().trim().required({ message: 'Current password is required' }),
  newPassword: yup.string().trim().required({ message: 'Password is required' }),
  confirmNewPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('newPassword'), null], { message: 'Passwords must match' }),
});

export const emailSchema = yup.object().shape({
  email: yup.string().trim().required({ message: 'You must provide an Email adress' }).email({ message: 'Please enter a valid email' }),
});

export const forgotPasswordSchema = yup.object().shape({
  password: yup.string().trim().required({ message: 'Password is required' }),
  passwordConfirm: yup
    .string()
    .trim()
    .oneOf([yup.ref('password'), null], { message: 'Passwords must match' }),
});
