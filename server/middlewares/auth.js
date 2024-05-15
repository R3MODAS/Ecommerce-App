import jwt from "jsonwebtoken"

export const auth = async (req,res,next) => {
    try {
        // get token from header
        const token = req.header("Authorization").replace("Bearer ","")

        // validation of token
        if(!token || token === undefined){
            return res.status(403).json({
                success: false,
                message: "Token is missing"
            })
        }

        // decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        // proceed to next handler function
        next()
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authenticating the user",
            error: err.message
        })
    }
}