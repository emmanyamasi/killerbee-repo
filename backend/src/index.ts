import express from "express";
import dotenv from "dotenv";

// load environment variables
dotenv.config();

// create express app
const app = express();

// read port from .env or default to 3000
const port = process.env.PORT || 3000;

// a simple test route
app.get("/", (req, res) => {
  res.send("Hello KillerBee! 🚀 Your backend is running.");
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
