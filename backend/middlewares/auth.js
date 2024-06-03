const { AsyncHandler } = require("../utils/asyncHandler")
const { ErrorHandler } = require("../utils/errorHandler")
const jwt = require("jsonwebtoken")

// Auth
exports.auth = AsyncHandler(async (req, res, next) => {
  // get the token from cookie
  const token = req.cookies.token

  // validation of token
  if (!token) {
    return next(new ErrorHandler("Invalid Token"))
  }

  // decode the payload
  const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)

  // pass the decoded payload inside req.user
  req.user = decodedPayload

  // move to next handler function
  next()
})

// Authorize Role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access ths resource`, 403))
    }
    next()
  }
}
