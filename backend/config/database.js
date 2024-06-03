const mongoose = require("mongoose")
const { DB_NAME } = require("../utils/constants")

const connectDB = () => {
    mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        .then((data) => {
            console.log(`MongoDB is connected successfully !! DB Host: ${data.connection.host}`)
        })
}

module.exports = connectDB