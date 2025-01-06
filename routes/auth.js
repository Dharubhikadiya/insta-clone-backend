const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middlewares/requireLogin");

// router.get("/", (req, res) => {
//   res.send("hello");
// });

router.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "Please add all required fields" });
  }

  try {
    const existingUser = await User.findOne({
      email: email,
      username: username,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with the email or username" });
    }
    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });
      user.save();
      res.status(201).json({ message: "Registered Successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save user" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please add email and password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(404).json({ error: "Invalid Email" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {
        if (match) {
          const token = jwt.sign({ _id: savedUser.id }, process.env.JWT_SECRET);
          const { _id, name, email, username } = savedUser;
          res.json({ token, user: { _id, name, email, username } });

          // return res
          //   .status(200)
          //   .json({ message: "Signed in successfully", token });
        } else {
          return res.status(400).json({ error: "Invalid Password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/googleLogin", (req, res) => {
  const { email_verified, email, name, clientId, userName, photo } = req.body;
  if (email_verified) {
    User.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        const token = jwt.sign({ _id: savedUser.id }, process.env.JWT_SECRET);
        const { _id, name, email, username } = savedUser;
        res.json({ token, user: { _id, name, email, username } });
      } else {
        const password = email + clientId;
        const user = new User({
          name,
          email,
          userName,
          password: password,
          photo,
        });
        user.save().then((user) => {
          let userId = user._id.toString();
          const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET);
          const { _id, name, email, username } = user;

          res.json({ token, user: { _id, name, email, username } });
        });
      }
    });
  }
});

module.exports = router;
