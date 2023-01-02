
const express = require("express");
const router = express.Router();
const Book = require("../models/book");

const passport = require("passport");
const { initialize:initializePassport, isAdmin:isAdmin}  = require("../passportConfig");
initializePassport(passport);

// Getting all
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", passport.authenticate("jwt", { session: false }), getBook, (req, res) => {
  res.json(res.book);
});

// Create one
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {

  if (!isAdmin(req)) {
    res.status(403).json({ message: "insufficient righs to add the book" });
    return
  }
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    cover: req.body.cover,
    description: req.body.description,
    edition: req.body.edition,
    pages: req.body.pages,
    publishing_date: req.body.publishing_date,
    publisher: req.body.publisher,
    serie: req.body.serie,
    part_of_series: req.body.part_of_series,
    created_by: req.user.email,
  });
  try {
    const exist = await existBook(req,res)
    if (exist) {
      res.status(422).json({ message: "book object with the same title and author already exists" });
      return
    }
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one
router.patch("/:id", passport.authenticate("jwt", { session: false }), getBook, async (req, res) => {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "insufficient righs to update the book" });
    return
  }
  if (req.body.title != null) {
    res.book.title = req.body.title;
  }
  if (req.body.author != null) {
    res.book.author = req.body.author;
  }
  if (req.body.cover != null) {
    res.book.cover = req.body.cover;
  }
  if (req.body.description != null) {
    res.book.description = req.body.description;
  }
  if (req.body.edition != null) {
    res.book.edition = req.body.edition;
  }
  if (req.body.pages != null) {
    res.book.pages = req.body.pages;
  }
  if (req.body.publishing_date != null) {
    res.book.publishing_date = req.body.publishing_date;
  }
  if (req.body.publisher != null) {
    res.book.publisher = req.body.publisher;
  }
  if (req.body.serie != null) {
    res.book.serie = req.body.serie;
  }
  if (req.body.part_of_series != null) {
    res.book.part_of_series = req.body.part_of_series;
  }

  res.book.updated_at = Date.now();

  try {    
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Delete one
router.delete("/:id", passport.authenticate("jwt", { session: false }), getBook, async (req, res) => {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "insufficient righs to delete the book" });
    return
  }    
  try {
    await res.book.remove();
    res.json({ message: "Deleted book" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBook(req, res, next) {
  let book;
  try {
    book = await Book.findById(req.params.id);
    if (book == null) {
      return res.status(404).json({ message: "Cannot find book" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.book = book;
  next();
}


async function existBook(req,res) {
  try {
    const book = await Book.find({ title: req.body.title, author: req.body.author});
    if (book.length === 0) {
      return false
    } else {
      return true
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}



module.exports = router;
