const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");


const passport = require("passport");
const { isAdmin } = require("../passportConfig");

// Getting all
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let searchPattern = {}
      if (req.query.search != null && req.query.search.length > 0) {
        searchPattern = { content: new RegExp(req.query.search,'i') } 
      }
      let bookIdPattern = {}
      if (req.query.book_id != null && req.query.book_id.length > 0) {
        bookIdPattern = { book_id: req.query.book_id } 
      }
  
      let userPattern = {}
      if (req.query.user != null && req.query.user.length > 0) {
        userPattern = { user: req.query.user } 
      }
      query = {...searchPattern, ...bookIdPattern, ...userPattern}
      const comments = await Comment.find(query);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// Getting one
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getComment,
  (req, res) => {
    res.json(res.comment);
  }
);


// Create one
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const comment = new Comment({
      book_id: req.body.book_id,
      user: req.user.email,
      content: req.body.content,
      created_by: req.user.email,
    });
    try {
      const newComment = await comment.save();
      res.status(201).json(newComment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Update one
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getComment,
  authorizePatchComment,
  async (req, res) => {
    if (req.body.content != null) {
      res.comment.content = req.body.content;
    }
    res.comment.updated_at = Date.now();
    try {
      const updatedComment = await res.comment.save();
      res.json(updatedComment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Delete one
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getComment,
  authorizeDeleteComment,
  async (req, res) => {
    try {
      await res.comment.remove();
      res.json({ message: "Deleted comment" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getComment(req, res, next) {
  let comment;
  try {
    comment = await Comment.findById(req.params.id);
    if (comment == null) {
      return res.status(404).json({ message: "Cannot find comment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.comment = comment;
  next();
}

async function authorizeDeleteComment(req, res, next) {
  try {
    if (req.method === "DELETE" && res.comment.user != req.user.email && !isAdmin(req)) {
      return res
        .status(403)
        .json({ message: "Forbidden to delete comment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

async function authorizePatchComment(req, res, next) {
  try {
    if (req.method === "PATCH" && res.comment.user != req.user.email && !isAdmin(req)) {
      return res
        .status(403)
        .json({ message: "Forbidden to update comment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

module.exports = router;
