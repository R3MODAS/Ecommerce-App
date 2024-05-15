import mongoose from "mongoose"
import { DB_NAME } from "../utils/constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB is connected successfully !! DB Host:`,connectionInstance.connection.host)
    } catch (err) {
        console.log("MongoDB connection failed: ",err.message)
        process.exit(1)
    }
}

export default connectDB