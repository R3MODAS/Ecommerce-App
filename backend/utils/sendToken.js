const sendToken = (user, statusCode, res, message) => {
    // generate a JWT token
    const token = user.generateJWTToken()

    //  create an options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    // return the response
    return res.cookie("token", token, options).status(statusCode).json({
        success: true,
        message: `${message}`,
        user,
        token
    })
}

module.exports = sendToken