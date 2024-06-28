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
