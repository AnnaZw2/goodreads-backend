const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticate = require("../autheniticateConfig.js");

const {

  isAdmin: isAdmin,
} = require("../passportConfig");


// Getting all
router.get(
  "/",
  authenticate
 ,
  authorizeUsers,
  async (req, res) => {
    try {
      let searchPattern = {}
      if (req.query.search != null && req.query.search.length > 0) {
        searchPattern = { $or: [{ email: new RegExp(req.query.search, 'i') }, { username: new RegExp(req.query.search, 'i') }] }
      }
      const users = await User.find(searchPattern);
      users.forEach(user => {
        user.password = undefined;
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Getting one
router.get(
  "/:email",
  authenticate,
  getUser,
  authorizeUsers,
  (req, res) => {
    delete res.user.password;
    console.log(res.user);
    res.json(res.user);
  }
);

// Update one
router.patch(
  "/:email",
  authenticate,
  getUser,
  async (req, res) => {
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
      updatedUser.password=undefined;
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Delete one
router.delete(
  "/:email",
  authenticate,
  getUser,
  authorizeUsers,
  async (req, res) => {
    try {
      await res.user.remove();
      res.json({ message: "Deleted user" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getUser(req, res, next) {
  let user;
  try {
    console.log(req.params.email);
    user = await User.find({ email: req.params.email });
    if (user.length === 0) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // user[0].password = undefined
  res.user = user[0]
  console.log(res.user);
  next();
}

async function authorizeUsers(req, res, next) {
  try {
    if (req.method === "GET") {
      // all users res.user == null
      if (!isAdmin(req) && res.user == null) {
        return res.status(403).json({ message: "insuficient rights" });
      }
      if (
        !isAdmin(req) &&
        res.user != null &&
        res.user.email != req.user.email
      ) {
        return res.status(403).json({ message: "insuficient rights" });
      }
    }
    
    if (req.method === "DELETE" && !isAdmin(req) && req.user.email != res.user.email) {
      return res.status(403).json({ message: "insuficient rights" });
    }
    if (
      !isAdmin(req) &&
      req.method === "PATCH" &&
      req.user.email != res.user.email
    ) {
      return res.status(403).json({ message: "insuficient rights" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  next();
}

module.exports = router;
