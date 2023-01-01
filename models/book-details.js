const mongoose = require('mongoose')
const getActiveUser = require('../user')

const bookDetailsSchema = new mongoose.Schema({
  book_id: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: false,
    default: getActiveUser
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
    max: 5
  },  
  shelves: {
    type: [String],
    required: false
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
    required:false,
    default: getActiveUser
  }   
})

module.exports = mongoose.model('BookDetails', bookDetailsSchema)