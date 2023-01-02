const express = require("express");
const router = express.Router();
const User = require("../models/user");

const passport = require("passport");
const { initialize:initializePassport, isAdmin:isAdmin}  = require("../passportConfig");
initializePassport(passport);

// Getting all
router.get("/", passport.authenticate("jwt", { session: false }), authorizeUsers, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:email", passport.authenticate("jwt", { session: false }), getUser, authorizeUsers, (req, res) => {
  res.json(res.user);
});


// Update one
router.patch("/:email", passport.authenticate("jwt", { session: false }), getUser, async (req, res) => {
  if (isAdmin(req)) {
    if (req.body.role != null) {
      res.user.role = req.body.role;
    }

  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.avatar_url != null) {
    res.user.avatar_url = req.body.avatar_url;
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
  router.delete("/:email",  passport.authenticate("jwt", { session: false }), getUser, authorizeUsers, async (req, res) => {
    try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    console.log(req.params.email);
    user = await User.find({email: req.params.email});
    if (user.length === 0) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user[0];
  console.log(res.user)
  next();
}



async function authorizeUsers(req, res, next) {
  try {
    if (req.method === "GET") {
    // all users res.user == null
    if (!isAdmin(req) && res.user == null) {
      return res
        .status(403)
        .json({ message: "insuficient rights" });
    }
    console.log(res.user.email)
    console.log(req.user.email)
    if (!isAdmin(req) && res.user != null && res.user.email != req.user.email ) {
      return res
      .status(403)
      .json({ message: "insuficient rights" });      
    }
  }
  if (req.method === "DELETE" && !isAdmin(req)) {
      return res
        .status(403)
        .json({ message: "insuficient rights" });
    }
    if (!isAdmin(req) && req.method === "PATCH" && req.user.email != res.user.email ) {
      return res
        .status(403)
        .json({ message: "insuficient rights" });
    }

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

module.exports = router;
