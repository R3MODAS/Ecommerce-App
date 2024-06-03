const sendToken = (user, res, statusCode, message) => {
  // get the generated token
  const token = user.generateJWTToken()

  // create options for cookie
  const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
      httpOnly: true
  }

  // create a cookie
  res.cookie("token", token, options)
      .status(statusCode)
      .json({
          success: true,
          message: `${message}`,
          token, user
      })
}

module.exports = sendToken
