
const express = require("express");
const router = express.Router();
const BookDetails = require("../models/book-details");
const getActiveUser = require('../user')

// Getting all
router.get("/", async (req, res) => {
  try {
    const books = await BookDetails.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getBookDetails, (req, res) => {
  res.json(res.bookDetails);
});

// Create one
router.post("/", async (req, res) => {
  const bookDetails = new BookDetails({
    book_id: req.body.book_id,
    user: req.body.user,
    rating: req.body.rating,
    shelves: req.body.shelves,
  });
  try {
    const exist = await existBookDetails(req,res)
    if (exist) {
      res.status(422).json({ message: "details object for the same book and user already exists" });
      return
    }
    const newBookDetails = await bookDetails.save();
    res.status(201).json(newBookDetails);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one
router.patch("/:id", getBookDetails, async (req, res) => {
  if (req.body.book_id != null) {
    res.bookDetails.book_id = req.body.book_id;
  }
  if (req.body.user != null) {
    res.bookDetails.user = req.body.user;
  }
  if (req.body.rating != null) {
    res.bookDetails.rating = req.body.rating;
  }
  if (req.body.shelves != null) {
    res.bookDetails.shelves = req.body.shelves;
  }

  res.bookDetails.updated_at = Date.now();


  try {
    const updatedBookDetails = await res.bookDetails.save();
    res.json(updatedBookDetails);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one
router.delete("/:id", getBookDetails, async (req, res) => {
  try {
    await res.bookDetails.remove();
    res.json({ message: "Deleted bookDetails" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

async function existBookDetails(req,res) {
  try {
    let user = req.body.user;
    if (user == null) {
      user = getActiveUser()
    }
    const bookDetails = await BookDetails.find({ book_id: req.body.book_id, user: user});
    console.log(bookDetails);
    if (bookDetails.length  === 0) {
      return false
    } else {
      return true
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


module.exports = router;
