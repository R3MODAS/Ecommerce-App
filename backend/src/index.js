import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

// Uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

dotenv.config({ path: "src/.env" });
const PORT = process.env.PORT || 6000;

// Connecting to db
connectDB();

// Connecting to server
const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});
