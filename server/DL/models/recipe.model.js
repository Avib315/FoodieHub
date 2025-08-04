const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
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
  }],
  ingredients: [{
    name: {
      type: String,
      required: true,
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
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'draft'],
    default: 'draft'
  }
}, {
  timestamps: true
});


const recipeModel = mongoose.model("Recipe", recipeSchema);

module.exports = recipeModel;