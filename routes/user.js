const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const User = mongoose.model("User");
const requireLogin = require("../middlewares/requireLogin");

router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      POST.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .then((posts) => {
          res.json({ user, posts });
        })
        .catch((err) => {
          return res.status(422).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(422).json({ error: "Invalid User ID" });
    });
});

router.put("/follow", requireLogin, async (req, res) => {
  try {
    const updatedFollowedUser = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );

    if (!updatedFollowedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

router.put("/unfollow", requireLogin, async (req, res) => {
  try {
    const updatedUnfollowedUser = await User.findByIdAndUpdate(
      req.body.followId,
      { $pull: { followers: req.user._id } },
      { new: true }
    );

    if (!updatedUnfollowedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.followId } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

router.put("/uploadprofilepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { photo: req.body.pic } },
    { new: true }
  )
    .then((user) => res.json(user))
    .catch((err) => res.status(422).json({ error: err.message }));
});

module.exports = router;
