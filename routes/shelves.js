
const express = require("express");
const router = express.Router();
const Shelf = require("../models/shelf");

const passport = require("passport");
const { initialize:initializePassport, isAdmin:isAdmin}  = require("../passportConfig");
initializePassport(passport);


// Getting all
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const shelves = await Shelf.find({ $or: [{ user: req.user.email}, {type: "standard"}]});
    res.json(shelves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", passport.authenticate("jwt", { session: false }), getShelf, authorizeShelf, (req, res) => {
  res.json(res.shelf);
});

// Create one
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {

  let type = req.body.type
  if (req.user.role != "admin") {
    type = "custom"
  }  
  const shelf = new Shelf({
    name: req.body.name,
    type: type,
    sort: req.body.sort,
    user: req.user.email,
    created_by: req.user.email
  });
  try {  
    const exist = await existShelf(req,res)
    if (exist) {
      res.status(422).json({ message: "shelf object with the same name and user already exists" });
      return
    } 
    const newShelf = await shelf.save();
    res.status(201).json(newShelf);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one
router.patch("/:id", passport.authenticate("jwt", { session: false }), getShelf, authorizeShelf, async (req, res) => {
  if (req.body.name != null) {
    res.shelf.name = req.body.name;
  }
  if (req.body.sort != null) {
    res.shelf.sort = req.body.sort;
  }

  if (req.user.role === "admin") {
    if (req.body.type != null) {
      res.shelf.type = req.body.type;
    }
    if (req.body.user != null) {
      res.shelf.user = req.body.user;
    }
  
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
router.delete("/:id", passport.authenticate("jwt", { session: false }), getShelf, authorizeShelf, async (req, res) => {
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

async function authorizeShelf(req, res, next) {
  let shelf;
  try {
    shelf = res.shelf
    if (req.method === "GET") {
      if (shelf.user != req.user.email && 
        shelf.type == "custom" &&
        req.user.role != "admin") {
        return res.status(403).json({ message: "Forbidden to access shelf" });      
      }       
    }
    if ((req.method === "DELETE") || (req.method === "PATCH") || (req.method === "PUT")) {
      if (shelf.user != req.user.email && 
          req.user.role != "admin") {
        return res.status(403).json({ message: "Forbidden to access shelf" });      
      }       
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}



async function existShelf(req,res) {
  try {
    const shelf = await Shelf.find({ name: req.body.name, user: req.user.email});
    if (shelf.length  === 0) {
      return false
    } else {
      return true
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}



module.exports = router;

