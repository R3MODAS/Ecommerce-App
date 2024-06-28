import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";

const connectDB = () => {
    mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`).then((data) => {
        console.log(
            `MongoDB is connected successfully !! DB Host: ${data.connection.host}`
        );
    });
};

export default connectDB;
