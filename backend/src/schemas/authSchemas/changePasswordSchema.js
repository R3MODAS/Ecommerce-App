import joi from "joi";

export const changePasswordSchema = joi.object({
    oldPassword: joi.string().required().lowercase().trim(),
    newPassword: joi.string().required().lowercase().trim(),
    confirmNewPassword: joi.string().required().lowercase().trim(),
});
