const mongoose = require('mongoose')

const shelfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  sort: {
    type: Number,
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
  }  
})

module.exports = mongoose.model('Shelf', shelfSchema)