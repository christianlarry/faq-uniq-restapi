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
  username: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be at most 20 characters long",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),

  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp(/[A-Z]/), { name: "uppercase letter" })
    .pattern(new RegExp(/[a-z]/), { name: "lowercase letter" })
    .pattern(new RegExp(/[0-9]/), { name: "number" })
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.name": "Password must contain at least one {#name}",
    }),
});

const updateValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be at most 20 characters long",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
});

const passwordValidation = Joi.string()
  .min(8)
  .required()
  .pattern(new RegExp(/[A-Z]/), { name: "uppercase letter" })
  .pattern(new RegExp(/[a-z]/), { name: "lowercase letter" })
  .pattern(new RegExp(/[0-9]/), { name: "number" })
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.name": "Password must contain at least one {#name}",
});

export {
  loginValidation,
  registerValidation,
  passwordValidation,
  updateValidation
};
