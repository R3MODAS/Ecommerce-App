import app from "./app.js"
import connectDB from "./db/index.js"

process.loadEnvFile()

// MongoDB connection and App Setup
const PORT = process.env.PORT || 6001
connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log(`Something went wrong while connecting to MongoDB: ${err.message}`)
        })

        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`)
        })
    })
    .catch((err) => {
        console.log(`Failed to connect to MongoDB: ${err.message}`)
    })
