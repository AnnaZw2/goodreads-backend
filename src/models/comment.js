const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const commentSchema = new mongoose.Schema({
  book_id: {
    type: ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
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
  },
  blocked:{
    is_blocked:{
      type: Boolean,
      required:true,
      default: false
    },
    by:{
      type: String,
      required:false,
      trim: true,
      minlength: 3
    },
    at:{
      type: Date,
      required:false,
      default: Date.now
    },
    reason:{
      type: String,
      required:false,
      trim: true,
      minlength: 3
    }
  }
})

module.exports = mongoose.model('Comment', commentSchema)