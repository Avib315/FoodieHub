const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null // עבור תגובות רגילות, יהיה null. עבור תשובות לתגובה יהיה מזהה התגובה המקורית
},
content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
},
status: {
    type: String,
    enum: ['active', 'pending', 'hidden', 'deleted'],
    default: 'active'
},
isEdited: {
    type: Boolean,
    default: false
},
editedAt: {
    type: Date,
    default: null
}
}, {
    timestamps: true
});
const commentModel = mongoose.model("Comment", commentSchema);

module.exports = { commentModel };