import Joi from "joi";

// Login validation schema
const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email harus berupa alamat email yang valid',
    'any.required': 'Email wajib diisi',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password harus terdiri dari minimal 6 karakter',
    'any.required': 'Password wajib diisi',
  }),
});

// Register validation schema
const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email harus berupa alamat email yang valid',
    'any.required': 'Email wajib diisi',
  }),
  username: Joi.string().min(3).required().messages({
    'string.min': 'Username harus terdiri dari minimal 3 karakter',
    'any.required': 'Username wajib diisi',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password harus terdiri dari minimal 6 karakter',
    'any.required': 'Password wajib diisi',
  }),
});

export {
  loginValidation,
  registerValidation
};
