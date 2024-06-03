const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to Uncaught Exception`)
  process.exit(1)
})

dotenv.config({ path: "backend/config/.env" });
const PORT = process.env.PORT || 6000;

// Connecting to Database
connectDB()

const server = app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server due to Unhandled Promise Rejection`)

  server.close(() => {
    process.exit(1)
  })
})