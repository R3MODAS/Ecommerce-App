const joi = require("joi")

const resetPasswordTokenSchema = joi.object({
    email: joi.string().trim().email().lowercase().pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required()
})

module.exports = { resetPasswordTokenSchema }