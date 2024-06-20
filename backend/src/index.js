// Imports
const app = require("./app");
const dotenv = require("dotenv");
const dbConnect = require("./db");

// Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Setting up dotenv
dotenv.config({ path: "src/.env" });
const PORT = process.env.PORT || 6000;

// Connecting to database
dbConnect();

// Setting up server
const server = app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  server.close(() => {
    process.exit(1);
  });
});
