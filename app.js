const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const connectToDb = require("./db");

connectToDb();

// Middleware
app.use(express.json());

// Configure CORS
const allowedOrigins = [
  "https://insta-clone-frontend-ln6u.vercel.app", // Add your Vercel frontend URL
  "http://localhost:3000", // For local testing (optional)
];

app.use(
  cors({
    origin: allowedOrigins, // Allow only specific origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
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
