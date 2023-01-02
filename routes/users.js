const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

const { initialize:initializePassport, isAdmin:isAdmin}  = require("../passportConfig");
initializePassport(passport);

// Getting all
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:email", passport.authenticate("jwt", { session: false }), getUser, (req, res) => {
  console.log(req.user)
  res.json(res.user);
});


// Update one
router.patch("/:email", passport.authenticate("jwt", { session: false }), getUser, async (req, res) => {
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.role != null) {
    res.user.role = req.body.role;
  }
  res.user.updated_at = Date.now();

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one
// router.delete("/:email", passport.authenticate("jwt", { session: false }), getUser, async (req, res) => {
  router.delete("/:email", getUser, async (req, res) => {
    try {
    console.log("hhhh")
    console.log(res.user)
    await res.user.remove();
    res.json({ message: "Deleted user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.find({email: req.params.email.toLowerCase()});
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  console.log("aaaaa")
  console.log(user)

  res.user = user;
  next();
}

module.exports = router;
