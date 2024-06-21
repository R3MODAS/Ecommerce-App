const joi = require("joi");

const changePasswordSchema = joi.object({
   oldPassword: joi.string().trim().min(8).required(),
   newPassword: joi.string().trim().min(8).required(),
   confirmNewPassword: joi.string().trim().min(8).required(),
});

module.exports = { changePasswordSchema };
