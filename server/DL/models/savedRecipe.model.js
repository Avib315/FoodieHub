const mongoose = require('mongoose');
const savedRecipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },


}, {
  timestamps: true
});
const savedRecipeModel = new mongoose.model('SavedRecipe', savedRecipeSchema);
module.exports = savedRecipeModel;