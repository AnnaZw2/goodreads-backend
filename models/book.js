const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    required: false
  },  
  description: {
    type: String,
    required: true
  },
  edition: {
    type: String,
    required: false
  },
  pages: {
    type: Number,
    required: false
  },  
  publishing_date: {
    type: Date,
    required:false,
  },
  publisher: {
    type: String,
    required: false
  }, 
  serie: {
    type: String,
    required: false
  },
  part_of_series: {
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

module.exports = mongoose.model('Book', bookSchema)