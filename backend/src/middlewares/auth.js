const { AsyncHandler } = require("../utils/asyncHandler");
const { ErrorHandler } = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");

// Authorization middleware
exports.auth = AsyncHandler(async (req, res, next) => {
   // get the jwt token for verification
   const token = req.cookies.token;

   // verification of token
   if (!token) {
      return next(new ErrorHandler("Invalid token", 400));
   }

   // decode the payload using the token
   const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

   // pass the decoded payload inside request user to use it everytime user is authorized
   req.user = decodedPayload;

   // move to next handler function
   next();
});

// Authorize roles middleware
exports.authorizeRoles =
   (...roles) =>
   (req, res, next) => {
      // check if the role of the person is allowed to visit a particular route or not
      if (!roles.includes(req.user.role)) {
         return next(
            new ErrorHandler(
               `Role: ${req.user.role} is not allowed to access the resource`,
               403
            )
         );
      }

      // move to next handler function
      next();
   };
