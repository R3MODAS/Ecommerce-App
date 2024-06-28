import joi from "joi"

export const resetPasswordSchema = joi.object({
    password: joi.string().required().lowercase().trim(),
    confirmPassword: joi.string().required().lowercase().trim()
})