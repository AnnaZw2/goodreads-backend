const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  author: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  cover: {
    type: String,
    required: false,
    trim: true,
    minlength: 3
  },  
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  edition: {
    type: String,
    required: false,
    trim: true,
    minlength: 3
  },
  pages: {
    type: Number,
    required: false,
    min: 1
  },  
  publishing_date: {
    type: Date,
    required:false,
    min: Date.parse('1900-01-01')
  },
  publisher: {
    type: String,
    required: false,
    trim: true,
    minlength: 3
  }, 
  serie: {
    type: String,
    required: false,
    trim: true,
    minlength: 3
  },
  part_of_series: {
    type: Number,
    required: false,
    min: 1
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

module.exports = mongoose.model('Book', bookSchema)