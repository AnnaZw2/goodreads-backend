/** @format */

const util = require("util");
const express = require("express");
const router = express.Router();
const BookDetails = require("../models/book-details");
const Shelf = require("../models/shelf");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const passport = require("passport");

// Getting all
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let qSortDirection = "desc";
      let sortDirection = -1;
      let limit = 5;
      let qMatch = "user";
      let match = { user: req.user.email };
      if (
        req.query.sort_direction != null &&
        req.query.sort_direction.length > 0
      ) {
        switch (req.query.sort_direction.toLowerCase()) {
          case "asc":
            sortDirection = 1;
            qSortDirection = "asc";
            break;
          case "desc":
            sortDirection = -1;
            qSortDirection = "desc";
            break;
          default:
            res.status(400).json({
              message: "invalid sort direction - should be asc or desc",
            });
        }
      }

      if (
        req.query.limit != null &&
        req.query.limit.length > 0 &&
        !isNaN(req.query.limit)
      ) {
        limit = parseInt(req.query.limit);
      }

      if (req.query.stat_type != null && req.query.stat_type.length > 0) {
        switch (req.query.stat_type.toLowerCase()) {
          case "global":
            match = {};
            qMatch = "global";
            break;
          case "user":
            match = { user: req.user.email };
            qMatch = "user";
            break;
          default:
            res
              .status(400)
              .json({ message: "invalid stat type: should be global or user" });
        }
      }

      const query = [
        { $match: match },
        {
          $group: {
            _id: "$book_id",
            average: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
        {
          $match: {
            $expr: { $ne: ["$average", null] },
          },
        },
        { $sort: { average: sortDirection } },
        { $limit: limit },
      ];

      console.log(
        util.inspect(query, { showHidden: false, depth: null, colors: true })
      );
      const books = await BookDetails.aggregate(query).exec();

      meta = {
        meta: {
          sort_direction: qSortDirection,
          limit: limit,
          match: match,
          match_type: qMatch,
        },
        books: books,
      };
      res.json(meta);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Getting all
router.get(
  "/shelves",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let qMatch = "user";
      let match = { user: req.user.email };
      if (req.query.stat_type != null && req.query.stat_type.length > 0) {
        switch (req.query.stat_type.toLowerCase()) {
          case "global":
            match = {};
            qMatch = "global";
            break;
          case "user":
            match = { user: req.user.email };
            qMatch = "user";
            break;
          default:
            res
              .status(400)
              .json({ message: "invalid stat type: should be global or user" });
        }
      }

      let qShelfId = {};
      if (req.query.shelf_id != null && req.query.shelf_id.length > 0) {
        qShelfId = { shelves: { $in: [ObjectId(req.query.shelf_id)] } };
      } else {
        res.status(400).json({ message: "shelf_id paramter is mandatory" });
      }

      const query = { ...match, ...qShelfId };
      console.log(
        util.inspect(query, { showHidden: false, depth: null, colors: true })
      );

      const booksOnShelf = await BookDetails.find(query);

      meta = {
        meta: {
          match: match,
          match_type: qMatch,
          shelf_id: req.query.shelf_id,
        },
        books_on_shelf: {
          shelf_id: req.query.shelf_id,
          count: booksOnShelf.length,
        },
      };
      res.json(meta);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Getting all
router.get(
  "/states/:state_shelf",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let limit = 5;
      if (
        req.query.limit != null &&
        req.query.limit.length > 0 &&
        !isNaN(req.query.limit)
      ) {
        limit = parseInt(req.query.limit);
      }

      let query = {name: req.params.state_shelf, type: 'standard'}
      console.log(
        util.inspect(query, { showHidden: false, depth: null, colors: true })
      );

      const shelves = await Shelf.find(query)
      if (shelves.length == 0) {
        res.status(404).json({ message: "no shelf found" });
        return
      }
      if (shelves.length > 1 ) {
        res.status(404).json({ message: "too many shelves found" });
        return
      }
      
      const shelf = shelves[0]

      query = [
        { $match: { shelves: shelf._id } },
        { $group: { _id: "$book_id", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, shelf:req.params.state_shelf , book_id: "$_id", count: 1 } },
      ];
      console.log(
        util.inspect(query, { showHidden: false, depth: null, colors: true })
      );
      const books = await BookDetails.aggregate(query).exec();

      meta = {
        meta: {
          limit: limit,
          state_shelf: req.params.state_shelf,
        },
        books: books,
      };
      res.json(meta);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


module.exports = router;
