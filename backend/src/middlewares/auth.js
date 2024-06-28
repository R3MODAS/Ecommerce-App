import { AsyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken"

// Authorization
export const auth = AsyncHandler(async (req, res, next) => {
    // get the token
    const token = req.cookies.token

    // validation of token
    if (!token) {
        return next(new ErrorHandler("Invalid Token", 400))
    }

    // get the decoded payload
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)

    // pass the decoded value inside request
    req.user = decodedPayload

    // move to next handler function
    next()
})

// Authorize roles
export const authorizeRoles = (...roles) => (req, res, next) => {
    // check for the role of the logged in person is allowed to visit a particular route or not
    if (!roles.includes(req.user.role)) {
        return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access the resource`, 403))
    }

    // move to next handler function
    next()
}