import joi from "joi";

export const signUpSchema = joi.object({
    name: joi.string().required().min(3).max(30).trim(),
    email: joi
        .string()
        .email()
        .required()
        .lowercase()
        .trim()
        .pattern(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
    password: joi.string().required().min(8).trim(),
});

export const signInSchema = joi.object({
    email: joi
        .string()
        .email()
        .required()
        .lowercase()
        .trim()
        .pattern(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
    password: joi.string().required().min(8).trim(),
});

export const resetPasswordTokenSchema = joi.object({
    email: joi
        .string()
        .email()
        .required()
        .lowercase()
        .trim()
        .pattern(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
});

export const resetPasswordSchema = joi.object({
    password: joi.string().required().lowercase().trim(),
    confirmPassword: joi.string().required().lowercase().trim(),
});

export const changePasswordSchema = joi.object({
    oldPassword: joi.string().required().lowercase().trim(),
    newPassword: joi.string().required().lowercase().trim(),
    confirmNewPassword: joi.string().required().lowercase().trim(),
});
