
const express = require("express");
const router = express.Router();
const Shelf = require("../models/shelf");

// Getting all
router.get("/", async (req, res) => {
  try {
    const shelves = await Shelf.find();
    res.json(shelves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getShelf, (req, res) => {
  res.json(res.shelf);
});

// Create one
router.post("/", async (req, res) => {
  const shelf = new Shelf({
    name: req.body.name,
    type: req.body.type,
    sort: req.body.sort,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at,
  });
  try {
    const newShelf = await shelf.save();
    res.status(201).json(newShelf);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one
router.patch("/:id", getShelf, async (req, res) => {
  if (req.body.name != null) {
    res.shelf.name = req.body.name;
  }
  if (req.body.type != null) {
    res.shelf.type = req.body.type;
  }
  if (req.body.sort != null) {
    res.shelf.sort = req.body.sort;
  }

  res.shelf.updated_at = Date.now();


  try {
    const updatedShelf = await res.shelf.save();
    res.json(updatedShelf);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Delete one
router.delete("/:id", getShelf, async (req, res) => {
  try {
    await res.shelf.remove();
    res.json({ message: "Deleted shelf" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getShelf(req, res, next) {
  let shelf;
  try {
    shelf = await Shelf.findById(req.params.id);
    if (shelf == null) {
      return res.status(404).json({ message: "Cannot find shelf" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.shelf = shelf;
  next();
}

module.exports = router;
