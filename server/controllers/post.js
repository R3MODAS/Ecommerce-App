import User from "../models/User.js"
import Post from "../models/Post.js"

export const createPost = async (req, res) => {
    try {
        // get data from request body
        const { userId, description, picturePath } = req.body

        // check if the user exists in the db or not
        const user = await User.findById({_id: userId})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User is not found"
            })
        }

        // create a new post
        const newPost = await User.create()

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the post",
            error: err.message
        })
    }
}

export const getFeedPosts = async (req, res) => {
    try {

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting all the posts",
            error: err.message
        })
    }
}

export const getUserPosts = async (req, res) => { }

export const likePost = async (req, res) => { }
