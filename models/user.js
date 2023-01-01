const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true, 
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: "user",
  },
  created_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  try {
    // check method of registration
    const user = this;
    // set first account with email admin@localhost to have role=admin
    if (user.email === 'admin@localhost') {
      this.role = "admin"
    }
    if (!user.isModified("password")) next(); 
    // generate salt
    const salt = await bcrypt.genSalt(10); 
    // hash the password
    const hashedPassword = await bcrypt.hash(this.password, salt); 
    // replace plain text password with hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = mongoose.model("User", userSchema);
