const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'רשימת קניות'
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: false,
      min: 0
    },
    unit: {
      type: String,
      required: false
    },
    isPurchased: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      trim: true
    },
    addedFrom: {
      type: String,
      enum: ['manual', 'recipe'],
      default: 'manual'
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      default: null
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }],
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});
const shoppingListModel = mongoose.model('ShoppingList', shoppingListSchema);
module.exports = shoppingListModel;
