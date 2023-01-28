const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const commentSchema = new mongoose.Schema({
  book_id: {
    type: ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: String,
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
    required:false
  }       
})

module.exports = mongoose.model('Comment', commentSchema)