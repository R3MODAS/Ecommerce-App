import User from "../models/User.js"
import Post from "../models/Post.js"

// Create a post
export const createPost = async (req, res) => {
    try {
        // get data from request body
        const { userId, description, picturePath } = req.body

        // check if the user exists in the db or not
        const user = await User.findById({ _id: userId })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not found"
            })
        }

        // create a new post
        const newPost = await Post.create({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            userPicturePath: user.picturePath,
            description,
            picturePath,
            likes: {},
            comments: []
        })

        // get all the posts
        const posts = await Post.find()

        // return the response
        return res.status(201).json({
            success: true,
            posts
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the post",
            error: err.message
        })
    }
}

// Get all the posts made by every user on feed
export const getFeedPosts = async (req, res) => {
    try {
        // find all the posts made by every user
        const posts = await Post.find()

        // return the response
        return res.status(200).json({
            success: true,
            posts
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting all the posts",
            error: err.message
        })
    }
}

// Get all the posts made by a particular user
export const getUserPosts = async (req, res) => {
    try {
        // get the user id from request params
        const { userId } = req.params

        // find all the posts made by the user
        const userposts = await Post.find({ userId })

        // return the response
        return res.status(200).json({
            success: true,
            userposts
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting the posts of the user",
            error: err.message
        })
    }
}

// Like a post
export const likePost = async (req, res) => {
    try {
        // get the post id from request params
        const { id } = req.params

        // get the user id from request body
        const { userId } = req.body

        // check if the post exists in the db or not
        const post = await Post.findById(id)
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post is not found"
            })
        }

        // check if the user already liked the post or not 
        const isLiked = post.likes.get(userId)
        if (isLiked) {
            post.likes.delete(userId)
        }
        else {
            post.likes.set(userId, true)
        }

        // update the like to the post
        const updatedPost = await Post.findByIdAndUpdate(
            { _id: id },
            { likes: post.likes },
            { new: true }
        )

        // return the response
        return res.status(200).json({
            success: true,
            updatedPost
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while liking a post",
            error: err.message
        })
    }
}
