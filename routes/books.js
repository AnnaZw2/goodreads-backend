
const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// Getting all
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getBook, (req, res) => {
  res.json(res.book);
});

// Create one
router.post("/", async (req, res) => {
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
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
  });
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one
router.patch("/:id", getBook, async (req, res) => {
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
router.delete("/:id", getBook, async (req, res) => {
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

module.exports = router;
