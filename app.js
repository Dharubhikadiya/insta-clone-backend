const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const connectToDb = require("./db");
const bcrypt = require("bcrypt");

connectToDb();

// Middleware
app.use(express.json());
app.use(cors());

// Models
require("./models/model");
require("./models/post");

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/createpost"));
app.use(require("./routes/user"));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
