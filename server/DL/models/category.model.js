const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  iconUrl: {
    type: String,
    default: null
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  recipeCount: {
    type: Number,
    default: 0
  }
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;