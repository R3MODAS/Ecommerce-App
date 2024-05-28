const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB is connected successfully !! DB Host: ${connectionInstance.connection.host}`)
    } catch (err) {
        console.log(err.message)
        process.exit(1)
    }
}

module.exports = connectDB