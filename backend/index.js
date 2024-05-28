const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config({ path: "backend/config/.env" })

const PORT = process.env.PORT || 6000

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("Error: ", err.message)
            throw new Error(err.message)
        })

        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`)
        })
    })
    .catch((err) => {
        console.log(`MongoDB connection failed: `, err.message)
    })



