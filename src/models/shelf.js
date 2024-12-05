const mongoose = require('mongoose')


const shelfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  type: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  sort: {
    type: Number,
    required: false
  },
  user: {
    type: String,
    required: false,
    trim: true,
    minlength: 3
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
    trim: true,
    minlength: 3
  }    
})

module.exports = mongoose.model('Shelf', shelfSchema)