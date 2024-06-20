const joi = require("joi");

const signUpSchema = joi.object({
  name: joi.string().min(3).max(50).required(),
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(8).required(),
});

const signInSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(8).required(),
});

module.exports = { signUpSchema, signInSchema };
