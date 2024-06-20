const joi = require("joi")

const resetPasswordSchema = joi.object({
    password: joi.string().trim().min(8).required(),
    confirmPassword: joi.string().trim().min(8).required()
})

module.exports = { resetPasswordSchema }