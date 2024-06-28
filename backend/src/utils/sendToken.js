export const sendToken = (user, res, statusCode, message) => {
    // get the generated jwt token
    const token = user.generateJWTToken();

    // create an options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // return the cookie and response
    return res.cookie("token", token, options).status(statusCode).json({
        success: true,
        message,
        token,
        user,
    });
};
