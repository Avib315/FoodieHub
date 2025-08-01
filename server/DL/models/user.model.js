const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'inactive'],
    default: 'active'
  },
  profileImageUrl: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  signupDate: {
    type: Date,
    default: Date.now
  }
});

const userModels = mongoose.model("User", userSchema);

module.exports = userModels;