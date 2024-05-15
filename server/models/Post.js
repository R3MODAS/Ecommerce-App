import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
        trim: true
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
        type: Map,
        of: Boolean
    },
    comment: {
        type: Array,
        default: []
    }
}, {timestamps: true})

const Post = mongoose.model("Post", postSchema)
export default Post