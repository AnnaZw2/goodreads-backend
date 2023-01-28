const mongoose = require('mongoose')
const Book = require("../models/book");
const ObjectId = mongoose.Types.ObjectId

const bookDetailsSchema = new mongoose.Schema({
  book_id: {
    type: ObjectId,
    required: true
  },
  user: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
    max: 5
  },  
  shelves: {
    type: [ObjectId],
    required: false
  },
  average_rating: {
    type: Number,
    required: false,
  },
  ratings_count: {
    type: Number,
    required: false,
  },
  created_at: {
    type: Date,
    required:false,
    default: Date.now
  },
  updated_at: {
    type: Date,
    required:false,
    default: Date.now
  },
  created_by: {
    type: String,
    required:false
  }
})

module.exports = mongoose.model('BookDetails', bookDetailsSchema)