const express = require("express");
const router = express.Router();
const BookDetails = require("../models/book-details");
// const Book = require("../models/book");
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const passport = require("passport");
const {
  initialize: initializePassport,
  isAdmin: isAdmin,
} = require("../passportConfig");
const { mqttClient } = require("../mqtt");

initializePassport(passport);

// Getting all
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let searchPattern = {}
      if (req.query.book_id != null && req.query.book_id.length > 0) {
        searchPattern =  { book_id: {_id: ObjectId(req.query.book_id)}}
        }
  
      const books = await BookDetails.find({ user: req.user.email, ...searchPattern});
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);
// /book-details/books/:id/sheleves/:id
// Getting all books on shelve id
router.get(
  "/shelves/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const books = await BookDetails.find({ user: req.user.email, shelves: {$in: [req.params.id]} });
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Getting one
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getBookDetails,
  authorizeBookDetails,
  (req, res) => {
    res.json(res.bookDetails);
  }
);

// Create one
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let rating = req.body.rating
    if (req.body.rating != null && req.body.rating == 0) {
      rating = undefined
    }
    const bookDetails = new BookDetails({
      book_id: req.body.book_id,
      user: req.user.email,
      rating: req.body.rating,
      shelves: req.body.shelves,
      created_by: req.user.email,
    });
    try {
      const exist = await existBookDetails(req, res);
      if (exist) {
        res
          .status(422)
          .json({
            message: "details object for the same book and user already exists",
          });
        return;
      }
      mqttClient.publish(process.env.MQTT_TOPIC_PREFIX+"book-details/created", JSON.stringify(bookDetails));
      const newBookDetails = await bookDetails.save();
      res.status(201).json(newBookDetails);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Update one
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getBookDetails,
  authorizeBookDetails,
  async (req, res) => {
    if (req.body.book_id != null) {
      res.bookDetails.book_id = req.body.book_id;
    }
    if (req.body.rating != null) {
      if (req.body.rating == 0 ) {
        res.bookDetails.rating = undefined
      } else {
        res.bookDetails.rating = req.body.rating;
      }
    }
    if (req.body.shelves != null) {
      res.bookDetails.shelves = req.body.shelves;

    }
    if (isAdmin(req)) {
      if (req.body.user != null) {
        res.bookDetails.user = req.body.user;
      }
    }
    res.bookDetails.updated_at = Date.now();

    try {
      mqttClient.publish(process.env.MQTT_TOPIC_PREFIX+"book-details/patched", JSON.stringify(res.bookDetails));
      const updatedBookDetails = await res.bookDetails.save();
      res.json(updatedBookDetails);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Delete one
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getBookDetails,
  authorizeBookDetails,
  async (req, res) => {
    try {
      await res.bookDetails.remove();
      res.json({ message: "Deleted bookDetails" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

async function getBookDetails(req, res, next) {
  let bookDetails;
  try {
    bookDetails = await BookDetails.findById(req.params.id);
    if (bookDetails == null) {
      return res.status(404).json({ message: "Cannot find bookDetails" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.bookDetails = bookDetails;
  next();
}

async function authorizeBookDetails(req, res, next) {
  try {
    if (res.bookDetails.user != req.user.email && !isAdmin(req)) {
      return res
        .status(403)
        .json({ message: "Forbidden to access bookDetails" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

async function existBookDetails(req, res) {
  try {
    const bookDetails = await BookDetails.find({
      book_id: req.body.book_id,
      user: req.user.email,
    });
    if (bookDetails.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
