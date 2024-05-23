const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Config
dotenv.config({path: "backend/config/.env"})
const PORT = process.env.PORT || 6001

// Connecting to DB
connectDB()

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})