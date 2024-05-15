import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Register User
export const register = async (req, res) => {
    try {
        // get data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body

        // validation of data
        if (!firstName || !lastName || !email || !password || !picturePath || !friends || !location || !occupation) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create a new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })

        // return the response
        return res.status(201).json({
            success: true,
            newUser
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user",
            error: err.message
        })
    }
}

// Logging User
export const login = async (req, res) => {
    try {
        // get data from request body
        const { email, password } = req.body;

        // validation of data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if the user exists in the db or not
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        // compare the user password and db password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }

        // generate a jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // delete the password
        delete user.password

        // return the response
        return res.status(200).json({
            success: true,
            token,
            user
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging the user",
            error: err.message
        })
    }
}