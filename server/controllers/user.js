import User from "../models/User.js"

// Get User
export const getUser = async (req, res) => {
    try {
        // get user id from request params
        const { id } = req.params

        // check if the user exists with the id or not
        const user = await User.findById({ _id: id })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not found"
            })
        }

        // return the response
        return res.status(200).json({
            success: true,
            user
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting the user",
            error: err.message
        })
    }
}

// Get User Friends
export const getUserFriends = async (req, res) => {
    try {
        // get user id from request params
        const { id } = req.params

        // check if the user exists with the id or not
        const user = await User.findById({ _id: id })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not found"
            })
        }

        // get all the friends data
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        )

        // destructure the data required to send to the client
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => ({ _id, firstName, lastName, occupation, location, picturePath }))

        // return the response
        return res.status(200).json({
            success: true,
            formattedFriends
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting the user friends",
            error: err.message
        })
    }
}

// Add and Remove Friends
export const addRemoveFriends = async (req, res) => {
    try {
        // get userId and friendId from request params
        const { id, friendId } = req.params

        // check if the user exists in the db or not
        const user = await User.findById(id)
        const friend = await User.findById(friendId)

        // if the friend is included in the user's friendlist then remove them and also remove them from the friend's friendlist as well
        if (user.friends.includes(friendId)) {
            user.friends.filter(id => id !== friendId)
            friend.friends.filter(id => id !== id)
        }

        // if the friend is not included in the user's friendlist then add them to user's friendlist and also add the user to the friend's friendlist
        else {
            user.friends.push(friendId)
            friend.friends.push(id)
        }

        // save all the changes
        await user.save()
        await friend.save()

        // get all the friends data
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        )

        // destructure the data required from the friend's data
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => ({ _id, firstName, lastName, occupation, location, picturePath })
        )

        // return the response
        return res.status(200).json({
            success: true,
            formattedFriends
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding or removing friends",
            error: err.message
        })
    }
}