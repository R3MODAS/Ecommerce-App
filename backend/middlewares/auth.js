const { AsyncHandler } = require("../utils/asyncHandler");
const { ErrorHandler } = require("../utils/errorHandler");
const jwt = require("jsonwebtoken")

// Auth
exports.auth = AsyncHandler(async (req, res, next) => {
    // get token from cookie
    const token = req.cookies.token

    // validation of token
    if (!token || token === undefined) {
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }

    // decode the payload
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)

    console.log(decodedPayload)

    // pass the payload inside req.user
    req.user = decodedPayload
    next()
})

// Authorize roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
            )
        }
    
        next()
    }
}