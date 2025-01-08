const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000; // Default port to 5000 if not set in .env
const cors = require("cors");
const connectToDb = require("./db");
const bcrypt = require("bcryptjs");

connectToDb();

// Middleware
app.use(express.json());

// Allow CORS for the frontend
const allowedOrigins = ["https://insta-clone-frontend-seven.vercel.app"]; // Add your frontend URL here
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies and other credentials
  })
);

// Models
require("./models/model");
require("./models/post");

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/createpost"));
app.use(require("./routes/user"));

// Test endpoint
app.get("/", (req, res) => {
  res.send("Hello, Instagram Clone Backend!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
