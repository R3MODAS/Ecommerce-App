const joi = require("joi")

const signUpSchema = joi.object({
    name: joi.string().trim().min(6).max(30).required(),
    email: joi.string().trim().email().lowercase().pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required(),
    password: joi.string().trim().min(8).required(),
});

module.exports = { signUpSchema }