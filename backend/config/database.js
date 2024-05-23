const mongoose = require("mongoose")

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL + "/ecommerce")
    .then((data) => {
        console.log(`MongoDB is connected successfully: ${data.connection.host}`)
    })
    .catch((err) => {
        console.log(err.message)
    })
}

module.exports = connectDB