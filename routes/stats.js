/** @format */

const express = require("express");
const router = express.Router();
const BookDetails = require("../models/book-details");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const passport = require("passport");

// Getting all
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let qSortDirection = 'desc';
      let sortDirection = -1;
      let limit = 5;
      let qMatch = 'user';
      let match = { user: req.user.email };
      if (
        req.query.sort_direction != null &&
        req.query.sort_direction.length > 0
      ) {
        switch (req.query.sort_direction.toLowerCase()) {
          case "asc":
            sortDirection = 1;
            qSortDirection = 'asc';
            break;
          case "desc":
            sortDirection = -1;
            qSortDirection = 'desc';
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
            qMatch = 'global';
            break;
          case "user":
            match = { user: req.user.email };
            qMatch = 'user';
            break;
          default:
            res
              .status(400)
              .json({ message: "invalid stat type: should be global or user" });
        }
      }

      const books = await BookDetails.aggregate([
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
      ]).exec();

      meta = {
        meta: { sort_direction: qSortDirection, limit: limit, match: match, match_type: qMatch },
        books: books,
      };
      res.json(meta);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
