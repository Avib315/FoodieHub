const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  instructions: [{
    stepNumber: { type: Number, required: true },
    text: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: null }
  }],
  ingredients: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['גרם', 'קילוגרם', 'מ"ל', 'ליטר', 'כף', 'כפית', 'כוס', 'יחידה', 'קורט']
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  prepTime: {
    type: Number, // דקות
    required: true,
    min: 0
  },
  cookTime: {
    type: Number, // דקות
    required: true,
    min: 0
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  difficultyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  imageUrl: {
    type: String,
    default: null
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'draft'],
    default: 'draft'
  },
  nutrition: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 }
  },
  viewCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


const recipeModel = mongoose.model("Recipe", recipeSchema);

module.exports = recipeModel;